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
exports.saveQuizResultById = exports.getQuizResultByUserId = exports.getQuizResults = exports.saveQuizResult = void 0;
const client_1 = require("../config/client");
const saveQuizResult = (quizId, User, score) => __awaiter(void 0, void 0, void 0, function* () {
    score = Number(score);
    if (isNaN(score) || score < 0)
        score = 0;
    const user = yield client_1.prisma.user.findUnique({ where: { id: User.id } });
    if (!user)
        throw new Error(`User with id ${User.id} not found`);
    const result = yield client_1.prisma.result.create({
        data: {
            sum: score,
            quizId,
            userId: user.id,
            score,
        },
    });
    console.log("✅ Đã lưu kết quả quiz mới cho user:", user.id);
    return result;
});
exports.saveQuizResult = saveQuizResult;
const getQuizResults = () => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield client_1.prisma.result.findMany({
        take: 3,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { score: "desc" },
    });
    return results;
});
exports.getQuizResults = getQuizResults;
const saveQuizResultById = (quizId, userId, score) => __awaiter(void 0, void 0, void 0, function* () {
    score = Number(score);
    if (isNaN(score) || score < 0)
        score = 0;
    const user = yield client_1.prisma.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new Error(`User with id ${userId} not found`);
    const quiz = yield client_1.prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz)
        throw new Error(`Quiz with id ${quizId} does not exist`);
    yield client_1.prisma.result.create({
        data: {
            sum: score,
            quizId,
            userId: user.id,
            score,
        },
    });
    const updatedUser = yield client_1.prisma.user.findUnique({
        where: { id: userId },
        include: { results: true },
    });
    return updatedUser;
});
exports.saveQuizResultById = saveQuizResultById;
const getQuizResultByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield client_1.prisma.result.findMany({
        where: { userId: +userId },
        orderBy: { id: "desc" },
    });
    return results;
});
exports.getQuizResultByUserId = getQuizResultByUserId;
//# sourceMappingURL=result.service.js.map