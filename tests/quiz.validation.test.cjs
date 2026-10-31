const assert = require("node:assert/strict");
const { test } = require("node:test");

const {
  parseQuizId,
  parseQuizPackageQuery,
} = require("../dist/validation/quiz.validation");
const {
  toPublicQuizDto,
  toQuizPackageDto,
} = require("../dist/mapper/quiz.mapper");
const quizContent = require("../src/config/quiz-content.json");

test("parses positive safe quiz IDs", () => {
  assert.equal(parseQuizId("42"), 42);
  assert.equal(parseQuizId("0"), null);
  assert.equal(parseQuizId("-1"), null);
  assert.equal(parseQuizId("1.5"), null);
  assert.equal(parseQuizId("9007199254740992"), null);
});

test("parses difficulty case-insensitively and defaults count to ten", () => {
  assert.deepEqual(parseQuizPackageQuery("easy", undefined), {
    difficulty: "EASY",
    count: 10,
  });
  assert.deepEqual(parseQuizPackageQuery("HARD", "25"), {
    difficulty: "HARD",
    count: 25,
  });
});

test("rejects invalid difficulty and question counts", () => {
  for (const [difficulty, count] of [
    ["expert", "10"],
    ["MEDIUM", "0"],
    ["EASY", "-1"],
    ["HARD", "51"],
    ["EASY", "1.5"],
    [["EASY"], "10"],
  ]) {
    assert.equal(parseQuizPackageQuery(difficulty, count), null);
  }
});

test("quiz package DTO includes the answer key for each option", () => {
  const result = toQuizPackageDto(7, "MEDIUM", [{
    id: 21,
    content: "Question?",
    difficulty: "MEDIUM",
    answers: [
      { id: 31, content: "Correct", isCorrect: 1 },
      { id: 32, content: "Incorrect", isCorrect: 0 },
    ],
  }]);

  assert.deepEqual(result, {
    quizId: "7",
    difficulty: "medium",
    questions: [{
      id: "21",
      questionText: "Question?",
      options: [
        { id: "31", text: "Correct", isCorrect: true },
        { id: "32", text: "Incorrect", isCorrect: false },
      ],
    }],
  });
  assert.equal(result.questions[0].options[0].isCorrect, true);
  assert.equal(result.questions[0].options[1].isCorrect, false);
});

test("legacy quiz DTO exposes difficulty and answer correctness", () => {
  const result = toPublicQuizDto({
    id: 7,
    title: "Quiz",
    description: null,
    questions: [{
      id: 21,
      content: "Question?",
      difficulty: "HARD",
      answers: [{ id: 31, content: "Option", isCorrect: 1 }],
    }],
  });

  assert.equal(result.questions[0].difficulty, "HARD");
  assert.equal(result.questions[0].answers[0].isCorrect, true);
});

test("C++ and Python seed questions have exactly one correct option", () => {
  for (const title of ["C++", "Python"]) {
    const quiz = quizContent.find((item) => item.title === title);
    assert.ok(quiz, `${title} seed exists`);
    assert.equal(quiz.questions.length, 20);
    for (const [index, question] of quiz.questions.entries()) {
      assert.equal(
        question.answers.filter((answer) => answer.isCorrect).length,
        1,
        `${title} question ${index + 1} has exactly one correct option`
      );
    }
  }
});
