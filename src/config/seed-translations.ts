import { readFileSync } from "fs";
import { join } from "path";
import { Prisma } from "@prisma/client";
import { prisma } from "./client";

type QuizContentSeed = {
  title: string;
  description: string;
  questions: Array<{
    content: string;
    answers: Array<{ content: string; isCorrect: boolean }>;
  }>;
};

type QuizIdRow = { id: number; title: string };
type QuestionIdRow = { id: number; quizId: number };
type AnswerIdRow = { id: number; questionId: number };
type LastInsertIdRow = { id: bigint };

const quizContent = JSON.parse(
  readFileSync(join(__dirname, "quiz-content.json"), "utf8")
) as QuizContentSeed[];

const seedQuizTranslations = async () => {
  for (const quiz of quizContent) {
    for (const [index, question] of quiz.questions.entries()) {
      if (question.answers.length !== 4) {
        throw new Error(`${quiz.title} question ${index + 1} must have four options`);
      }
      const correctCount = question.answers.filter((answer) => answer.isCorrect).length;
      if (correctCount !== 1) {
        throw new Error(
          `${quiz.title} question ${index + 1} must have exactly one correct option`
        );
      }
    }
  }

  await prisma.$transaction(async (transaction) => {
    const quizzes = await transaction.$queryRaw<QuizIdRow[]>`
      SELECT
        quiz.id,
        COALESCE((
          SELECT translation.title
          FROM quiz_translations AS translation
          WHERE translation.quizId = quiz.id AND translation.language = 'VI'
          ORDER BY translation.id
          LIMIT 1
        ), '') AS title
      FROM quizzes AS quiz
      ORDER BY quiz.id
    `;
    if (quizzes.length !== quizContent.length) {
      throw new Error(
        `Expected ${quizContent.length} existing quizzes, found ${quizzes.length}`
      );
    }

    const quizTranslations: Array<{
      quizId: number;
      title: string;
      description: string;
    }> = [];
    const questionTranslations: Array<{ questionId: number; content: string }> = [];
    const answerTranslations: Array<{ answerId: number; content: string }> = [];
    const answerCorrectness: Array<{ answerId: number; isCorrect: boolean }> = [];

    for (const [quizIndex, seedQuiz] of quizContent.entries()) {
      const quiz = quizzes[quizIndex];
      if (quiz.title && quiz.title !== seedQuiz.title) {
        throw new Error(
          `Quiz at position ${quizIndex + 1} is "${quiz.title}", expected "${seedQuiz.title}"`
        );
      }

      const questions = await transaction.$queryRaw<QuestionIdRow[]>`
        SELECT id, quizId FROM questions
        WHERE quizId = ${quiz.id}
        ORDER BY id
      `;
      if (questions.length > seedQuiz.questions.length) {
        throw new Error(
          `Quiz ${quiz.id} has ${questions.length} questions; seed contains ${seedQuiz.questions.length}`
        );
      }

      for (let index = questions.length; index < seedQuiz.questions.length; index += 1) {
        const [seedQuestion] = seedQuiz.questions.slice(index, index + 1);
        await transaction.$executeRaw`
          INSERT INTO questions (quizId) VALUES (${quiz.id})
        `;
        const [inserted] = await transaction.$queryRaw<LastInsertIdRow[]>`
          SELECT LAST_INSERT_ID() AS id
        `;
        const questionId = Number(inserted.id);
        questions.push({ id: questionId, quizId: quiz.id });

        await transaction.$executeRaw(Prisma.sql`
          INSERT INTO answers (questionId, isCorrect)
          VALUES ${Prisma.join(seedQuestion.answers.map((answer) =>
            Prisma.sql`(${questionId}, ${answer.isCorrect})`
          ))}
        `);
      }

      quizTranslations.push({
        quizId: quiz.id,
        title: seedQuiz.title,
        description: seedQuiz.description,
      });

      for (const [questionIndex, seedQuestion] of seedQuiz.questions.entries()) {
        const questionId = questions[questionIndex].id;
        const answers = await transaction.$queryRaw<AnswerIdRow[]>`
          SELECT id, questionId FROM answers
          WHERE questionId = ${questionId}
          ORDER BY id
        `;
        if (answers.length !== seedQuestion.answers.length) {
          throw new Error(
            `Question ${questionId} has ${answers.length} answers; ` +
            `expected ${seedQuestion.answers.length}`
          );
        }

        questionTranslations.push({
          questionId,
          content: seedQuestion.content,
        });
        for (const [answerIndex, seedAnswer] of seedQuestion.answers.entries()) {
          const answerId = answers[answerIndex].id;
          answerTranslations.push({
            answerId,
            content: seedAnswer.content,
          });
          answerCorrectness.push({
            answerId,
            isCorrect: seedAnswer.isCorrect,
          });
        }
      }
    }

    await transaction.$executeRaw(Prisma.sql`
      INSERT INTO quiz_translations (quizId, language, title, description)
      VALUES ${Prisma.join(quizTranslations.map((row) =>
        Prisma.sql`(${row.quizId}, 'VI', ${row.title}, ${row.description})`
      ))}
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description)
    `);

    await transaction.$executeRaw(Prisma.sql`
      INSERT INTO question_translations (questionId, language, content)
      VALUES ${Prisma.join(questionTranslations.map((row) =>
        Prisma.sql`(${row.questionId}, 'VI', ${row.content})`
      ))}
      ON DUPLICATE KEY UPDATE content = VALUES(content)
    `);

    await transaction.$executeRaw(Prisma.sql`
      INSERT INTO answer_translations (answerId, language, content)
      VALUES ${Prisma.join(answerTranslations.map((row) =>
        Prisma.sql`(${row.answerId}, 'VI', ${row.content})`
      ))}
      ON DUPLICATE KEY UPDATE content = VALUES(content)
    `);

    await transaction.$executeRaw(Prisma.sql`
      UPDATE answers
      SET isCorrect = CASE id
        ${Prisma.join(answerCorrectness.map((row) =>
          Prisma.sql`WHEN ${row.answerId} THEN ${row.isCorrect}`
        ), " ")}
        ELSE isCorrect
      END
      WHERE id IN (${Prisma.join(answerCorrectness.map(({ answerId }) => answerId))})
    `);

    console.log(
      `Synchronized Vietnamese content and answer keys for ${quizzes.length} quizzes, ` +
      `${questionTranslations.length} questions, and ${answerTranslations.length} answers.`
    );
  });
};

seedQuizTranslations()
  .catch((error) => {
    console.error("Quiz content seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
