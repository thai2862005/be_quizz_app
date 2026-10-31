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
exports.getQuizPackage = exports.getQuizzBuyId = exports.getALLQuizzes = exports.CreateQuestion = exports.CreateQuiz = void 0;
const client_1 = require("../config/client");
const quiz_mapper_1 = require("../mapper/quiz.mapper");
const client_2 = require("@prisma/client");
const getQuizRows = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const whereClause = id === undefined
        ? client_2.Prisma.empty
        : client_2.Prisma.sql `WHERE quiz.id = ${id}`;
    return client_1.prisma.$queryRaw `
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
});
const getQuestionRows = (quizIds, difficulty, count) => __awaiter(void 0, void 0, void 0, function* () {
    if (quizIds.length === 0) {
        return [];
    }
    const difficultyFilter = difficulty === undefined
        ? client_2.Prisma.empty
        : client_2.Prisma.sql `AND ranked.difficulty = ${difficulty}`;
    const questionLimit = count === undefined
        ? client_2.Prisma.empty
        : client_2.Prisma.sql `LIMIT ${count}`;
    return client_1.prisma.$queryRaw `
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
      WHERE ranked.quizId IN (${client_2.Prisma.join(quizIds)})
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
});
const groupQuestionRows = (rows) => {
    var _a, _b;
    const questions = new Map();
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
                content: (_a = row.answerContent) !== null && _a !== void 0 ? _a : "",
                isCorrect: (_b = row.isCorrect) !== null && _b !== void 0 ? _b : false,
            });
        }
    }
    return [...questions.values()];
};
const CreateQuiz = (title, description, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quiz = yield client_1.prisma.quiz.create({
            data: {
                title,
                description,
                user: {
                    connect: { id: userId },
                },
            },
        });
        return quiz;
    }
    catch (error) {
        throw error;
    }
});
exports.CreateQuiz = CreateQuiz;
const CreateQuestion = (quizId_1, content_1, answers_1, ...args_1) => __awaiter(void 0, [quizId_1, content_1, answers_1, ...args_1], void 0, function* (quizId, content, answers, difficulty = "MEDIUM") {
    try {
        const question = yield client_1.prisma.question.create({
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
    }
    catch (error) {
        throw error;
    }
});
exports.CreateQuestion = CreateQuestion;
const getALLQuizzes = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const quizzes = yield getQuizRows();
    const questionRows = yield getQuestionRows(quizzes.map(({ id }) => id));
    const rowsByQuiz = new Map();
    for (const row of questionRows) {
        const quizRows = (_a = rowsByQuiz.get(row.quizId)) !== null && _a !== void 0 ? _a : [];
        quizRows.push(row);
        rowsByQuiz.set(row.quizId, quizRows);
    }
    return quizzes.map((quiz) => {
        var _a;
        return (0, quiz_mapper_1.toPublicQuizDto)(Object.assign(Object.assign({}, quiz), { questions: groupQuestionRows((_a = rowsByQuiz.get(quiz.id)) !== null && _a !== void 0 ? _a : []) }));
    });
});
exports.getALLQuizzes = getALLQuizzes;
const getQuizzBuyId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const [quiz] = yield getQuizRows(id);
    if (!quiz) {
        return null;
    }
    const questions = groupQuestionRows(yield getQuestionRows([id]));
    return (0, quiz_mapper_1.toPublicQuizDto)(Object.assign(Object.assign({}, quiz), { questions }));
});
exports.getQuizzBuyId = getQuizzBuyId;
const getQuizPackage = (quizId, difficulty, count) => __awaiter(void 0, void 0, void 0, function* () {
    const [quiz] = yield getQuizRows(quizId);
    if (!quiz) {
        return null;
    }
    const questions = groupQuestionRows(yield getQuestionRows([quizId], difficulty, count));
    return (0, quiz_mapper_1.toQuizPackageDto)(quiz.id, difficulty, questions);
});
exports.getQuizPackage = getQuizPackage;
//# sourceMappingURL=quizz.service.js.map