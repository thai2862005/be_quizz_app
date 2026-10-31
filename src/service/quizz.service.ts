import { prisma } from "../config/client";
import { toPublicQuizDto, toQuizPackageDto } from "../mapper/quiz.mapper";
import type { QuizDifficulty } from "../validation/quiz.validation";
import { Prisma } from "@prisma/client";

type QuizRow = {
  id: number;
  title: string;
  description: string | null;
};

type QuestionAnswerRow = {
  id: number;
  quizId: number;
  content: string;
  difficulty: QuizDifficulty;
  answerId: number | null;
  answerContent: string | null;
  isCorrect: boolean | null;
};

type QuizQuestion = {
  id: number;
  content: string;
  difficulty: QuizDifficulty;
  answers: Array<{ id: number; content: string; isCorrect: boolean }>;
};

const getQuizRows = async (id?: number): Promise<QuizRow[]> => {
  const whereClause = id === undefined
    ? Prisma.empty
    : Prisma.sql`WHERE quiz.id = ${id}`;

  return prisma.$queryRaw<QuizRow[]>`
    SELECT
      quiz.id,
      COALESCE((
        SELECT translation.title
        FROM quiz_translations AS translation
        WHERE translation.quizId = quiz.id
        ORDER BY CASE translation.language
          WHEN 'VI' THEN 0
          WHEN 'EN' THEN 1
          ELSE 2
        END, translation.id
        LIMIT 1
      ), '') AS title,
      (
        SELECT translation.description
        FROM quiz_translations AS translation
        WHERE translation.quizId = quiz.id
        ORDER BY CASE translation.language
          WHEN 'VI' THEN 0
          WHEN 'EN' THEN 1
          ELSE 2
        END, translation.id
        LIMIT 1
      ) AS description
    FROM quizzes AS quiz
    ${whereClause}
    ORDER BY quiz.id
  `;
};

const getQuestionRows = async (
  quizIds: number[],
  difficulty?: QuizDifficulty,
  count?: number
): Promise<QuestionAnswerRow[]> => {
  if (quizIds.length === 0) {
    return [];
  }

  const difficultyFilter = difficulty === undefined
    ? Prisma.empty
    : Prisma.sql`AND ranked.difficulty = ${difficulty}`;
  const questionLimit = count === undefined
    ? Prisma.empty
    : Prisma.sql`LIMIT ${count}`;

  return prisma.$queryRaw<QuestionAnswerRow[]>`
    WITH ranked_questions AS (
      SELECT
        question.id,
        question.quizId,
        COALESCE((
          SELECT translation.content
          FROM question_translations AS translation
          WHERE translation.questionId = question.id
          ORDER BY CASE translation.language
            WHEN 'VI' THEN 0
            WHEN 'EN' THEN 1
            ELSE 2
          END, translation.id
          LIMIT 1
        ), '') AS content,
        CASE
          WHEN ROW_NUMBER() OVER (
            PARTITION BY question.quizId ORDER BY question.id
          ) <= CEIL(COUNT(*) OVER (
            PARTITION BY question.quizId
          ) / 3)
            THEN 'EASY'
          WHEN ROW_NUMBER() OVER (
            PARTITION BY question.quizId ORDER BY question.id
          ) <= CEIL(2 * COUNT(*) OVER (
            PARTITION BY question.quizId
          ) / 3)
            THEN 'MEDIUM'
          ELSE 'HARD'
        END AS difficulty
      FROM questions AS question
    ),
    selected_questions AS (
      SELECT ranked.id, ranked.quizId, ranked.content, ranked.difficulty
      FROM ranked_questions AS ranked
      WHERE ranked.quizId IN (${Prisma.join(quizIds)})
      ${difficultyFilter}
      ORDER BY ranked.id
      ${questionLimit}
    )
    SELECT
      question.id,
      question.quizId,
      question.content,
      question.difficulty,
      answer.id AS answerId,
      answer.isCorrect AS isCorrect,
      (
        SELECT translation.content
        FROM answer_translations AS translation
        WHERE translation.answerId = answer.id
        ORDER BY CASE translation.language
          WHEN 'VI' THEN 0
          WHEN 'EN' THEN 1
          ELSE 2
        END, translation.id
        LIMIT 1
      ) AS answerContent
    FROM selected_questions AS question
    LEFT JOIN answers AS answer ON answer.questionId = question.id
    ORDER BY question.id, answer.id
  `;
};

const groupQuestionRows = (rows: QuestionAnswerRow[]): QuizQuestion[] => {
  const questions = new Map<number, QuizQuestion>();

  for (const row of rows) {
    let question = questions.get(row.id);
    if (!question) {
      question = {
        id: row.id,
        content: row.content,
        difficulty: row.difficulty,
        answers: [],
      };
      questions.set(row.id, question);
    }

    if (row.answerId !== null) {
      question.answers.push({
        id: row.answerId,
        content: row.answerContent ?? "",
        isCorrect: row.isCorrect ?? false,
      });
    }
  }

  return [...questions.values()];
};

const CreateQuiz = async (title: string, description: string, userId: number) => {
  try {
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        user: {
          connect: { id: userId }, 
        },
      },
    });

    return quiz;
  } catch (error) {
    throw error;
  }
};
const CreateQuestion = async (
  quizId: number,
  content: string,
  answers: Array<{ content: string; isCorrect: boolean }>,
  difficulty: QuizDifficulty = "MEDIUM"
) => {
  try {
    const question = await prisma.question.create({
      data: {
        content,
        difficulty,
        quiz: {
          connect: { id: quizId },
        },
        answers: {
          create: answers.map((a) => ({
            content: a.content,
            isCorrect: a.isCorrect,
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    return question;
  } catch (error) {
    throw error;
  }
};

const getALLQuizzes = async () => {
  const quizzes = await getQuizRows();
  const questionRows = await getQuestionRows(quizzes.map(({ id }) => id));
  const rowsByQuiz = new Map<number, QuestionAnswerRow[]>();

  for (const row of questionRows) {
    const quizRows = rowsByQuiz.get(row.quizId) ?? [];
    quizRows.push(row);
    rowsByQuiz.set(row.quizId, quizRows);
  }

  return quizzes.map((quiz) => toPublicQuizDto({
    ...quiz,
    questions: groupQuestionRows(rowsByQuiz.get(quiz.id) ?? []),
  }));
};

const getQuizzBuyId = async (id:number) => {
  const [quiz] = await getQuizRows(id);
  if (!quiz) {
    return null;
  }

  const questions = groupQuestionRows(await getQuestionRows([id]));
  return toPublicQuizDto({ ...quiz, questions });
};

const getQuizPackage = async (
  quizId: number,
  difficulty: QuizDifficulty,
  count: number
) => {
  const [quiz] = await getQuizRows(quizId);
  if (!quiz) {
    return null;
  }

  const questions = groupQuestionRows(
    await getQuestionRows([quizId], difficulty, count)
  );
  return toQuizPackageDto(quiz.id, difficulty, questions);
};

export {
  CreateQuiz,
  CreateQuestion,
  getALLQuizzes,
  getQuizzBuyId,
  getQuizPackage,
};
