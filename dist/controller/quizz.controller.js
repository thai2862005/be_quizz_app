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
exports.getQuizzByIdApi = exports.getALLQuizzesApi = void 0;
const quizz_service_1 = require("../service/quizz.service");
const getALLQuizzesApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quizzes = yield (0, quizz_service_1.getALLQuizzes)();
        console.log("check", quizzes);
        res.status(200).json({ quizzes, message: "Quizzes retrieved successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getALLQuizzesApi = getALLQuizzesApi;
const getQuizzByIdApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const quiz = yield (0, quizz_service_1.getQuizzBuyId)(+id);
        if (quiz) {
            res.status(200).json({ quiz, message: "Quiz retrieved successfully" });
        }
        else {
            res.status(404).json({ message: "Quiz not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getQuizzByIdApi = getQuizzByIdApi;
//# sourceMappingURL=quizz.controller.js.map