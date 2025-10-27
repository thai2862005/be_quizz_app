import { prisma } from "../config/client";

const CreateQuiz = async (title: string, description: string, userId: number) => {
  try {
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        user: {
          connect: { id: userId }, 
        },
      },
    });

    return quiz;
  } catch (error) {
    throw error;
  }
};
const CreateQuestion = async (
  quizId: number,
  content: string,
  answers: Array<{ content: string; isCorrect: boolean }>
) => {
  try {
    const question = await prisma.question.create({
      data: {
        content,
        quiz: {
          connect: { id: quizId },
        },
        answers: {
          create: answers.map((a) => ({
            content: a.content,
            isCorrect: a.isCorrect,
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    return question;
  } catch (error) {
    throw error;
  }
};

const getALLQuizzes = async () => {
  try {
    const quizzes = await prisma.quiz.findMany({
        include: {
            questions: {
                include: {
                    answers: true,
                },
            },
        },
    });
    return quizzes;
  } catch (error) {
    throw error;
  }
};
export { CreateQuiz, CreateQuestion, getALLQuizzes };
