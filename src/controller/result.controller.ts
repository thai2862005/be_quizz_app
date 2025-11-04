import { Request,Response } from "express"
import { getQuizResults, saveQuizResult } from "../service/result.service";
import { message } from "antd";
const saveQuizResultAPi = async (req:Request,res:Response)=>{
    const {quizId,score} = req.body;
    const user = (req as any).user;
    if (!quizId || score === undefined) {
      return res.status(400).json({ message: "Thiếu quizId hoặc score" });
    }
    const result = await saveQuizResult(quizId,user,score);
    res.status(200).json({result,message:"Lưu kết quả thành công"})
}
const getQuizResultsApi = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) {
      return res.status(400).json({ message: "Thiếu userId" });
    }

    const results = await getQuizResults(userId);
    res.status(200).json({
      message: "Danh sách kết quả quiz",
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server khi lấy kết quả quiz" });
  }
};

export {
    saveQuizResultAPi,getQuizResultsApi
}