"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const client_1 = require("@prisma/client");
const client_2 = require("./client");
const quizContent = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(__dirname, "quiz-content.json"), "utf8"));
const seedQuizTranslations = () => __awaiter(void 0, void 0, void 0, function* () {
    for (const quiz of quizContent) {
        for (const [index, question] of quiz.questions.entries()) {
            if (question.answers.length !== 4) {
                throw new Error(`${quiz.title} question ${index + 1} must have four options`);
            }
            const correctCount = question.answers.filter((answer) => answer.isCorrect).length;
            if (correctCount !== 1) {
                throw new Error(`${quiz.title} question ${index + 1} must have exactly one correct option`);
            }
        }
    }
    yield client_2.prisma.$transaction((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const quizzes = yield transaction.$queryRaw `
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
            throw new Error(`Expected ${quizContent.length} existing quizzes, found ${quizzes.length}`);
        }
        const quizTranslations = [];
        const questionTranslations = [];
        const answerTranslations = [];
        const answerCorrectness = [];
        for (const [quizIndex, seedQuiz] of quizContent.entries()) {
            const quiz = quizzes[quizIndex];
            if (quiz.title && quiz.title !== seedQuiz.title) {
                throw new Error(`Quiz at position ${quizIndex + 1} is "${quiz.title}", expected "${seedQuiz.title}"`);
            }
            const questions = yield transaction.$queryRaw `
        SELECT id, quizId FROM questions
        WHERE quizId = ${quiz.id}
        ORDER BY id
      `;
            if (questions.length > seedQuiz.questions.length) {
                throw new Error(`Quiz ${quiz.id} has ${questions.length} questions; seed contains ${seedQuiz.questions.length}`);
            }
            for (let index = questions.length; index < seedQuiz.questions.length; index += 1) {
                const [seedQuestion] = seedQuiz.questions.slice(index, index + 1);
                yield transaction.$executeRaw `
          INSERT INTO questions (quizId) VALUES (${quiz.id})
        `;
                const [inserted] = yield transaction.$queryRaw `
          SELECT LAST_INSERT_ID() AS id
        `;
                const questionId = Number(inserted.id);
                questions.push({ id: questionId, quizId: quiz.id });
                yield transaction.$executeRaw(client_1.Prisma.sql `
          INSERT INTO answers (questionId, isCorrect)
          VALUES ${client_1.Prisma.join(seedQuestion.answers.map((answer) => client_1.Prisma.sql `(${questionId}, ${answer.isCorrect})`))}
        `);
            }
            quizTranslations.push({
                quizId: quiz.id,
                title: seedQuiz.title,
                description: seedQuiz.description,
            });
            for (const [questionIndex, seedQuestion] of seedQuiz.questions.entries()) {
                const questionId = questions[questionIndex].id;
                const answers = yield transaction.$queryRaw `
          SELECT id, questionId FROM answers
          WHERE questionId = ${questionId}
          ORDER BY id
        `;
                if (answers.length !== seedQuestion.answers.length) {
                    throw new Error(`Question ${questionId} has ${answers.length} answers; ` +
                        `expected ${seedQuestion.answers.length}`);
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
        yield transaction.$executeRaw(client_1.Prisma.sql `
      INSERT INTO quiz_translations (quizId, language, title, description)
      VALUES ${client_1.Prisma.join(quizTranslations.map((row) => client_1.Prisma.sql `(${row.quizId}, 'VI', ${row.title}, ${row.description})`))}
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description)
    `);
        yield transaction.$executeRaw(client_1.Prisma.sql `
      INSERT INTO question_translations (questionId, language, content)
      VALUES ${client_1.Prisma.join(questionTranslations.map((row) => client_1.Prisma.sql `(${row.questionId}, 'VI', ${row.content})`))}
      ON DUPLICATE KEY UPDATE content = VALUES(content)
    `);
        yield transaction.$executeRaw(client_1.Prisma.sql `
      INSERT INTO answer_translations (answerId, language, content)
      VALUES ${client_1.Prisma.join(answerTranslations.map((row) => client_1.Prisma.sql `(${row.answerId}, 'VI', ${row.content})`))}
      ON DUPLICATE KEY UPDATE content = VALUES(content)
    `);
        yield transaction.$executeRaw(client_1.Prisma.sql `
      UPDATE answers
      SET isCorrect = CASE id
        ${client_1.Prisma.join(answerCorrectness.map((row) => client_1.Prisma.sql `WHEN ${row.answerId} THEN ${row.isCorrect}`), " ")}
        ELSE isCorrect
      END
      WHERE id IN (${client_1.Prisma.join(answerCorrectness.map(({ answerId }) => answerId))})
    `);
        console.log(`Synchronized Vietnamese content and answer keys for ${quizzes.length} quizzes, ` +
            `${questionTranslations.length} questions, and ${answerTranslations.length} answers.`);
    }));
});
seedQuizTranslations()
    .catch((error) => {
    console.error("Quiz content seed failed:", error);
    process.exitCode = 1;
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield client_2.prisma.$disconnect();
}));
//# sourceMappingURL=seed-translations.js.map