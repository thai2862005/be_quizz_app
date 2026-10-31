"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQuizPackageQuery = exports.parseQuizId = void 0;
const isQuizDifficulty = (value) => value === "EASY" || value === "MEDIUM" || value === "HARD";
const parseQuizId = (value) => {
    if (!/^[1-9]\d*$/.test(value)) {
        return null;
    }
    const id = Number(value);
    return Number.isSafeInteger(id) ? id : null;
};
exports.parseQuizId = parseQuizId;
const parseQuizPackageQuery = (difficultyValue, countValue) => {
    if (typeof difficultyValue !== "string") {
        return null;
    }
    const difficulty = difficultyValue.toUpperCase();
    if (!isQuizDifficulty(difficulty)) {
        return null;
    }
    let count = 10;
    if (countValue !== undefined) {
        if (typeof countValue !== "string" || !/^[1-9]\d*$/.test(countValue)) {
            return null;
        }
        count = Number(countValue);
        if (!Number.isSafeInteger(count) || count > 50) {
            return null;
        }
    }
    return { difficulty, count };
};
exports.parseQuizPackageQuery = parseQuizPackageQuery;
//# sourceMappingURL=quiz.validation.js.map