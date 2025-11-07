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
exports.getQuizResultsApi = exports.saveQuizResultAPi = void 0;
const result_service_1 = require("../service/result.service");
const saveQuizResultAPi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quizId, score } = req.body;
    const user = req.user;
    if (!quizId || score === undefined) {
        return res.status(400).json({ message: "Thiếu quizId hoặc score" });
    }
    const result = yield (0, result_service_1.saveQuizResult)(quizId, user, score);
    res.status(200).json({ result, message: "Lưu kết quả thành công" });
});
exports.saveQuizResultAPi = saveQuizResultAPi;
const getQuizResultsApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.userId);
        if (!userId) {
            return res.status(400).json({ message: "Thiếu userId" });
        }
        const results = yield (0, result_service_1.getQuizResults)(userId);
        res.status(200).json({
            message: "Danh sách kết quả quiz",
            data: results,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server khi lấy kết quả quiz" });
    }
});
exports.getQuizResultsApi = getQuizResultsApi;
//# sourceMappingURL=result.controller.js.map