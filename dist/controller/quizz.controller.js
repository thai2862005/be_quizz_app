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
exports.getQuizPackageApi = exports.getQuizzByIdApi = exports.getALLQuizzesApi = void 0;
const quizz_service_1 = require("../service/quizz.service");
const quiz_validation_1 = require("../validation/quiz.validation");
const getALLQuizzesApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizzes = yield (0, quizz_service_1.getALLQuizzes)();
        res.status(200).json({ quizzes, message: "Quizzes retrieved successfully" });
    }
    catch (error) {
        console.error("Failed to retrieve quizzes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getALLQuizzesApi = getALLQuizzesApi;
const getQuizzByIdApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const quizId = (0, quiz_validation_1.parseQuizId)(id);
    if (quizId === null) {
        res.status(400).json({ code: "INVALID_QUIZ_ID", message: "Quiz ID must be a positive integer" });
        return;
    }
    try {
        const quiz = yield (0, quizz_service_1.getQuizzBuyId)(quizId);
        if (quiz) {
            res.status(200).json({ quiz, message: "Quiz retrieved successfully" });
        }
        else {
            res.status(404).json({ message: "Quiz not found" });
        }
    }
    catch (error) {
        console.error(`Failed to retrieve quiz ${quizId}:`, error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getQuizzByIdApi = getQuizzByIdApi;
const getQuizPackageApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const quizId = (0, quiz_validation_1.parseQuizId)(req.params.id);
    if (quizId === null) {
        res.status(400).json({ code: "INVALID_QUIZ_ID", message: "Quiz ID must be a positive integer" });
        return;
    }
    const query = (0, quiz_validation_1.parseQuizPackageQuery)(req.query.difficulty, req.query.count);
    if (!query) {
        res.status(400).json({
            code: "INVALID_QUIZ_PACKAGE_QUERY",
            message: "difficulty must be EASY, MEDIUM, or HARD and count must be between 1 and 50",
        });
        return;
    }
    try {
        const quizPackage = yield (0, quizz_service_1.getQuizPackage)(quizId, query.difficulty, query.count);
        if (!quizPackage) {
            res.status(404).json({ message: "Quiz not found" });
            return;
        }
        res.status(200).json({
            data: quizPackage,
            message: "Quiz package retrieved successfully",
        });
    }
    catch (error) {
        console.error(`Failed to retrieve quiz package for quiz ${quizId}:`, error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getQuizPackageApi = getQuizPackageApi;
//# sourceMappingURL=quizz.controller.js.map