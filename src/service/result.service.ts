import { prisma } from "../config/client";

const saveQuizResult = async (quizId: number, User:any, score: number) => {
score = Number(score);
if (isNaN(score) || score < 0) score = 0;
  const user = await prisma.user.findUnique({
    where:{id:User.id}
  })
const existingResult = await prisma.result.findFirst({
  where: { userId: user.id, quizId }
});

if (existingResult) {
  await prisma.result.update({
    where: { id: existingResult.id },
    data: {
      score,
      sum:{
        increment:score
      }
    }
  });

} else {
  await prisma.result.create({
    data: {
      sum:score,
      quizId,
      userId: user.id,
      score,
    }
  });

  console.log("✅ Đã lưu kết quả quiz mới cho user:", user.id);
}
};
const getQuizResults = async () => {
  const results = await prisma.result.findMany({
    take:3,
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { score: "desc" },
  });
  return results;
};

const getQuizResultByUserId = async (id: number) => {
    const results = await prisma.result.findUnique({
      where: { id: +id },
    })
    return results;
}
export {saveQuizResult,getQuizResults,getQuizResultByUserId}
