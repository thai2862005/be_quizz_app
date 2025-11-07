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
exports.getQuizResults = exports.saveQuizResult = void 0;
const client_1 = require("../config/client");
const saveQuizResult = (quizId, User, score) => __awaiter(void 0, void 0, void 0, function* () {
    score = Number(score);
    if (isNaN(score) || score < 0)
        score = 0;
    const user = yield client_1.prisma.user.findUnique({
        where: { id: User.id }
    });
    const existingResult = yield client_1.prisma.result.findFirst({
        where: { userId: user.id, quizId }
    });
    if (existingResult) {
        yield client_1.prisma.result.update({
            where: { id: existingResult.id },
            data: {
                score,
                sum: {
                    increment: score
                }
            }
        });
    }
    else {
        yield client_1.prisma.result.create({
            data: {
                sum: score,
                quizId,
                userId: user.id,
                score,
            }
        });
        console.log("✅ Đã lưu kết quả quiz mới cho user:", user.id);
    }
});
exports.saveQuizResult = saveQuizResult;
const getQuizResults = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield client_1.prisma.result.findMany({
        take: 3,
        where: { userId },
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { score: "desc" },
    });
    return results;
});
exports.getQuizResults = getQuizResults;
//# sourceMappingURL=result.service.js.map