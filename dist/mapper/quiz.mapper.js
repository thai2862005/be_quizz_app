"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicQuizDto = exports.toQuizPackageDto = void 0;
const toQuizPackageDto = (quizId, difficulty, questions) => ({
    quizId: String(quizId),
    difficulty: difficulty.toLowerCase(),
    questions: questions.map((question) => ({
        id: String(question.id),
        questionText: question.content,
        options: question.answers.map((answer) => ({
            id: String(answer.id),
            text: answer.content,
            isCorrect: Boolean(answer.isCorrect),
        })),
    })),
});
exports.toQuizPackageDto = toQuizPackageDto;
const toPublicQuizDto = (quiz) => ({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    questions: quiz.questions.map((question) => ({
        id: question.id,
        content: question.content,
        difficulty: question.difficulty,
        answers: question.answers.map((answer) => ({
            id: answer.id,
            content: answer.content,
            isCorrect: Boolean(answer.isCorrect),
        })),
    })),
});
exports.toPublicQuizDto = toPublicQuizDto;
//# sourceMappingURL=quiz.mapper.js.map