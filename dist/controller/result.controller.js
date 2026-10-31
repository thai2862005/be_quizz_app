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
exports.saveQuizResultByIdApi = exports.getQuizResultsApi = exports.saveQuizResultAPi = void 0;
const result_service_1 = require("../service/result.service");
const parsePositiveId = (value) => {
    if (!/^[1-9]\d*$/.test(value)) {
        return null;
    }
    const id = Number(value);
    return Number.isSafeInteger(id) ? id : null;
};
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
//get quiz results api
const saveQuizResultByIdApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { quizId, score, userId } = req.body;
        const authenticatedUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!Number.isSafeInteger(authenticatedUserId)) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        if (!Number.isSafeInteger(Number(quizId)) || Number(quizId) <= 0 ||
            !Number.isSafeInteger(Number(userId)) || Number(userId) <= 0 ||
            typeof score !== "number" || !Number.isFinite(score) || score < 0) {
            return res.status(400).json({ error: "quizId, userId and score are required" });
        }
        if (Number(userId) !== authenticatedUserId) {
            res.status(403).json({ message: "Cannot submit a result for another user" });
            return;
        }
        const result = yield (0, result_service_1.saveQuizResultById)(Number(quizId), Number(userId), Number(score));
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error saving quiz result:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.saveQuizResultByIdApi = saveQuizResultByIdApi;
const getQuizResultsApi = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authenticatedUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!Number.isSafeInteger(authenticatedUserId)) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        if (req.params.id !== undefined) {
            const requestedUserId = parsePositiveId(req.params.id);
            if (requestedUserId === null) {
                res.status(400).json({ code: "INVALID_USER_ID", message: "User ID must be a positive integer" });
                return;
            }
            if (requestedUserId !== authenticatedUserId) {
                res.status(403).json({ message: "Cannot retrieve another user's results" });
                return;
            }
        }
        const results = yield (0, result_service_1.getQuizResultByUserId)(authenticatedUserId);
        res.status(200).json({
            message: "Danh sách kết quả quiz",
            data: results,
        });
    }
    catch (error) {
        console.error("Failed to retrieve quiz results:", error);
        res.status(500).json({ message: "Lỗi server khi lấy kết quả quiz" });
    }
});
exports.getQuizResultsApi = getQuizResultsApi;
//# sourceMappingURL=result.controller.js.map