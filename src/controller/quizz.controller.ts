import { getALLQuizzes } from "../service/quizz.service";

const getALLQuizzesApi = async (req, res) => {
    try {
        const quizzes = await getALLQuizzes();
        console.log("check", quizzes);
        res.status(200).json({ quizzes, message: "Quizzes retrieved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
export { getALLQuizzesApi };