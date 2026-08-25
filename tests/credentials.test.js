const assert = require("node:assert/strict");
const { CredentialRegistry, gradeAssessment } = require("../dist/index");

const assessment = {
  passingPercent: 70,
  questions: [
    { id: "q1", correctAnswer: "A", points: 5 },
    { id: "q2", correctAnswer: "B", points: 5 },
  ],
};

const passed = gradeAssessment(assessment, { answers: { q1: "A", q2: "B" } });
assert.equal(passed.passed, true);

const registry = new CredentialRegistry();
const record = registry.record({
  id: "credential-1",
  learnerId: "learner-1",
  courseId: "course-1",
  title: "Course Completion",
  issuedAt: 1_700_000_000_000,
  evidence: {
    assessmentId: "assessment-1",
    passed: passed.passed,
    percentage: passed.percentage,
  },
});

assert.equal(record.status, "recorded");
assert.equal(record.externalCredentialIssued, false);
assert.equal(record.authorityVerificationPerformed, false);
assert.equal(record.evidence.percentage, 100);

assert.deepEqual(registry.listForLearner("learner-1").map((item) => item.id), ["credential-1"]);
assert.equal(registry.get("credential-1").courseId, "course-1");

assert.throws(
  () => registry.record({
    id: "credential-2",
    learnerId: "learner-1",
    courseId: "course-1",
    title: "Failed Attempt",
    issuedAt: 1_700_000_000_001,
    evidence: { assessmentId: "assessment-2", passed: false, percentage: 20 },
  }),
  /passed assessment/,
);

assert.throws(
  () => registry.record({
    id: "credential-1",
    learnerId: "learner-1",
    courseId: "course-1",
    title: "Duplicate",
    issuedAt: 1_700_000_000_002,
    evidence: { assessmentId: "assessment-3", passed: true, percentage: 90 },
  }),
  /already exists/,
);

record.evidence.percentage = 0;
assert.equal(registry.get("credential-1").evidence.percentage, 100);

console.log("credential tests passed");
