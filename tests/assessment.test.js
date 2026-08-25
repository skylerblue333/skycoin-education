const assert = require("node:assert/strict");
const { gradeAssessment } = require("../dist/index");

const assessment = {
  passingPercent: 70,
  questions: [
    { id: "q1", correctAnswer: "A", points: 2 },
    { id: "q2", correctAnswer: "B", points: 3 },
    { id: "q3", correctAnswer: "C", points: 5 },
  ],
};

const result = gradeAssessment(assessment, {
  answers: { q1: "A", q2: "wrong" },
});

assert.equal(result.earnedPoints, 2);
assert.equal(result.possiblePoints, 10);
assert.equal(result.percentage, 20);
assert.equal(result.passed, false);
assert.equal(result.answeredCount, 2);
assert.equal(result.correctCount, 1);
assert.deepEqual(result.questions[2], {
  id: "q3",
  answered: false,
  correct: false,
  earnedPoints: 0,
  possiblePoints: 5,
});

const passing = gradeAssessment(
  { ...assessment, passingPercent: 50 },
  { answers: { q1: "A", q2: "B" } },
);
assert.equal(passing.percentage, 50);
assert.equal(passing.passed, true);

assert.throws(() => gradeAssessment({ questions: [] }, { answers: {} }), /1-500 questions/);
assert.throws(
  () => gradeAssessment({ questions: [{ id: "q", correctAnswer: "x", points: 1 }, { id: "q", correctAnswer: "y", points: 1 }] }, { answers: {} }),
  /duplicate question id/,
);
assert.throws(() => gradeAssessment({ questions: [{ id: "q", correctAnswer: "x", points: 0 }] }, { answers: {} }), /points/);
assert.throws(() => gradeAssessment({ questions: [{ id: "q", correctAnswer: "x", points: 1 }], passingPercent: 101 }, { answers: {} }), /passingPercent/);
assert.throws(() => gradeAssessment({ questions: [{ id: "q", correctAnswer: "x", points: 1 }] }, { answers: { unknown: "x" } }), /unknown question id/);

console.log("assessment tests passed");
