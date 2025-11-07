import { getALLQuizzes, getQuizzBuyId } from "../service/quizz.service";
import { Request, Response } from "express";
const getALLQuizzesApi = async (req: Request, res: Response) => {
    try {
        const quizzes = await getALLQuizzes();
        console.log("check", quizzes);
        res.status(200).json({ quizzes, message: "Quizzes retrieved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const getQuizzByIdApi = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const quiz = await getQuizzBuyId(+id);
        if (quiz) {
            res.status(200).json({ quiz, message: "Quiz retrieved successfully" });
        } else {
            res.status(404).json({ message: "Quiz not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export { getALLQuizzesApi, getQuizzByIdApi };