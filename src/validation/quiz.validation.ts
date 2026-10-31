export type QuizDifficulty = "EASY" | "MEDIUM" | "HARD";

export type QuizPackageQuery = {
  difficulty: QuizDifficulty;
  count: number;
};

const isQuizDifficulty = (value: string): value is QuizDifficulty =>
  value === "EASY" || value === "MEDIUM" || value === "HARD";

export const parseQuizId = (value: string): number | null => {
  if (!/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
};

export const parseQuizPackageQuery = (
  difficultyValue: unknown,
  countValue: unknown
): QuizPackageQuery | null => {
  if (typeof difficultyValue !== "string") {
    return null;
  }

  const difficulty = difficultyValue.toUpperCase();
  if (!isQuizDifficulty(difficulty)) {
    return null;
  }

  let count = 10;
  if (countValue !== undefined) {
    if (typeof countValue !== "string" || !/^[1-9]\d*$/.test(countValue)) {
      return null;
    }

    count = Number(countValue);
    if (!Number.isSafeInteger(count) || count > 50) {
      return null;
    }
  }

  return { difficulty, count };
};
