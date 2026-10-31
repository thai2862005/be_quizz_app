import { prisma } from "../config/client";

const saveQuizResult = async (quizId: number, User: any, score: number) => {
  score = Number(score);
  if (isNaN(score) || score < 0) score = 0;

  const user = await prisma.user.findUnique({ where: { id: User.id } });
  if (!user) throw new Error(`User with id ${User.id} not found`);

  const result = await prisma.result.create({
    data: {
      sum: score,
      quizId,
      userId: user.id,
      score,
    },
  });

  console.log("✅ Đã lưu kết quả quiz mới cho user:", user.id);
  return result;
};

const getQuizResults = async () => {
  const results = await prisma.result.findMany({
    take: 3,
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { score: "desc" },
  });
  return results;
};

const saveQuizResultById = async (quizId: number, userId: number, score: number) => {
  score = Number(score);
  if (isNaN(score) || score < 0) score = 0;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error(`User with id ${userId} not found`);

  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
  if (!quiz) throw new Error(`Quiz with id ${quizId} does not exist`);

  await prisma.result.create({
    data: {
      sum: score,
      quizId,
      userId: user.id,
      score,
    },
  });

  const updatedUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { results: true },
  });

  return updatedUser;
};

const getQuizResultByUserId = async (userId: number) => {
  const results = await prisma.result.findMany({
    where: { userId: +userId },
    orderBy: { id: "desc" },
  });
  return results;
};

export { saveQuizResult, getQuizResults, getQuizResultByUserId, saveQuizResultById };