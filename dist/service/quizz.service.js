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
exports.getQuizzBuyId = exports.getALLQuizzes = exports.CreateQuestion = exports.CreateQuiz = void 0;
const client_1 = require("../config/client");
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
const CreateQuestion = (quizId, content, answers) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const question = yield client_1.prisma.question.create({
            data: {
                content,
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
    try {
        const quizzes = yield client_1.prisma.quiz.findMany({
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
            },
        });
        return quizzes;
    }
    catch (error) {
        throw error;
    }
});
exports.getALLQuizzes = getALLQuizzes;
const getQuizzBuyId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quiz = yield client_1.prisma.quiz.findUnique({
            where: { id: +id },
        });
        return quiz;
    }
    catch (error) {
        throw error;
    }
});
exports.getQuizzBuyId = getQuizzBuyId;
//# sourceMappingURL=quizz.service.js.map