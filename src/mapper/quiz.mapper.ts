import type { QuizDifficulty } from "../validation/quiz.validation";

type PublicQuizQuestion = {
  id: number;
  content: string;
  difficulty: string;
  answers: Array<{ id: number; content: string; isCorrect: boolean }>;
};

type QuizPackageQuestion = {
  id: number;
  content: string;
  answers: Array<{ id: number; content: string; isCorrect: boolean }>;
};

export const toQuizPackageDto = (
  quizId: number,
  difficulty: QuizDifficulty,
  questions: QuizPackageQuestion[]
) => ({
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

export const toPublicQuizDto = <
  T extends {
    id: number;
    title: string;
    description: string | null;
    questions: PublicQuizQuestion[];
  }
>(
  quiz: T
) => ({
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
