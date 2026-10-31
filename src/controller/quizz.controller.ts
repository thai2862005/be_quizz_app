import {
    getALLQuizzes,
    getQuizzBuyId,
    getQuizPackage,
} from "../service/quizz.service";
import { Request, Response } from "express";
import {
    parseQuizId,
    parseQuizPackageQuery,
} from "../validation/quiz.validation";

const getALLQuizzesApi = async (req: Request, res: Response) => {
    try {
        const quizzes = await getALLQuizzes();
        res.status(200).json({ quizzes, message: "Quizzes retrieved successfully" });
    } catch (error) {
        console.error("Failed to retrieve quizzes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getQuizzByIdApi = async (req: Request, res: Response) => {
    const { id } = req.params;
    const quizId = parseQuizId(id);
    if (quizId === null) {
        res.status(400).json({ code: "INVALID_QUIZ_ID", message: "Quiz ID must be a positive integer" });
        return;
    }

    try {
        const quiz = await getQuizzBuyId(quizId);
        if (quiz) {
            res.status(200).json({ quiz, message: "Quiz retrieved successfully" });
        } else {
            res.status(404).json({ message: "Quiz not found" });
        }
    } catch (error) {
        console.error(`Failed to retrieve quiz ${quizId}:`, error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getQuizPackageApi = async (req: Request, res: Response) => {
    const quizId = parseQuizId(req.params.id);
    if (quizId === null) {
        res.status(400).json({ code: "INVALID_QUIZ_ID", message: "Quiz ID must be a positive integer" });
        return;
    }

    const query = parseQuizPackageQuery(req.query.difficulty, req.query.count);
    if (!query) {
        res.status(400).json({
            code: "INVALID_QUIZ_PACKAGE_QUERY",
            message: "difficulty must be EASY, MEDIUM, or HARD and count must be between 1 and 50",
        });
        return;
    }

    try {
        const quizPackage = await getQuizPackage(quizId, query.difficulty, query.count);
        if (!quizPackage) {
            res.status(404).json({ message: "Quiz not found" });
            return;
        }

        res.status(200).json({
            data: quizPackage,
            message: "Quiz package retrieved successfully",
        });
    } catch (error) {
        console.error(`Failed to retrieve quiz package for quiz ${quizId}:`, error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export { getALLQuizzesApi, getQuizzByIdApi, getQuizPackageApi };