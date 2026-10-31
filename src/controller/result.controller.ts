import { Request,Response } from "express"
import {
  getQuizResultByUserId,
  saveQuizResult,
  saveQuizResultById,
} from "../service/result.service";

const parsePositiveId = (value: string): number | null => {
  if (!/^[1-9]\d*$/.test(value)) {
    return null;
  }
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
};

const saveQuizResultAPi = async (req:Request,res:Response)=>{
    const {quizId,score} = req.body;
    const user = (req as any).user;
    if (!quizId || score === undefined) {
      return res.status(400).json({ message: "Thiếu quizId hoặc score" });
    }
    const result = await saveQuizResult(quizId,user,score);
    res.status(200).json({result,message:"Lưu kết quả thành công"})
}

//get quiz results api
const saveQuizResultByIdApi = async (req: Request, res: Response) => {
  try {
    const { quizId, score, userId } = req.body;
    const authenticatedUserId = (req as any).user?.id;
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

    const result = await saveQuizResultById(Number(quizId), Number(userId), Number(score));
    res.status(200).json(result);

  } catch (error: any) {
    console.error("Error saving quiz result:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getQuizResultsApi = async (req: Request, res: Response) => {
  try {
    const authenticatedUserId = (req as any).user?.id;
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

    const results = await getQuizResultByUserId(authenticatedUserId);
    res.status(200).json({
      message: "Danh sách kết quả quiz",
      data: results,
    });
  } catch (error) {
    console.error("Failed to retrieve quiz results:", error);
    res.status(500).json({ message: "Lỗi server khi lấy kết quả quiz" });
  }
};

export {
    saveQuizResultAPi,getQuizResultsApi,saveQuizResultByIdApi
}