export type Question = {
  id: string;
  correctAnswer: string;
  points: number;
};

export type Assessment = {
  questions: Question[];
  passingPercent?: number;
};

export type Submission = {
  answers: Record<string, string>;
};

export type QuestionResult = {
  id: string;
  answered: boolean;
  correct: boolean;
  earnedPoints: number;
  possiblePoints: number;
};

export type AssessmentResult = {
  earnedPoints: number;
  possiblePoints: number;
  percentage: number;
  passed: boolean;
  answeredCount: number;
  correctCount: number;
  questions: QuestionResult[];
};

const MAX_QUESTIONS = 500;
const MAX_ID_LENGTH = 128;
const MAX_ANSWER_LENGTH = 2_000;

export function gradeAssessment(assessment: Assessment, submission: Submission): AssessmentResult {
  const normalized = validateAssessment(assessment);
  validateSubmission(submission, normalized.questions);

  const questions = normalized.questions.map((question): QuestionResult => {
    const answer = submission.answers[question.id];
    const answered = answer !== undefined;
    const correct = answered && answer === question.correctAnswer;
    return {
      id: question.id,
      answered,
      correct,
      earnedPoints: correct ? question.points : 0,
      possiblePoints: question.points,
    };
  });

  const possiblePoints = questions.reduce((sum, question) => sum + question.possiblePoints, 0);
  const earnedPoints = questions.reduce((sum, question) => sum + question.earnedPoints, 0);
  const percentage = possiblePoints === 0 ? 0 : (earnedPoints / possiblePoints) * 100;

  return {
    earnedPoints,
    possiblePoints,
    percentage,
    passed: percentage >= normalized.passingPercent,
    answeredCount: questions.filter((question) => question.answered).length,
    correctCount: questions.filter((question) => question.correct).length,
    questions,
  };
}

function validateAssessment(assessment: Assessment): Required<Assessment> {
  if (typeof assessment !== "object" || assessment === null || !Array.isArray(assessment.questions)) {
    throw new TypeError("assessment.questions must be an array");
  }
  if (assessment.questions.length === 0 || assessment.questions.length > MAX_QUESTIONS) {
    throw new RangeError(`assessment must contain 1-${MAX_QUESTIONS} questions`);
  }

  const ids = new Set<string>();
  const questions = assessment.questions.map((question) => {
    if (typeof question !== "object" || question === null) throw new TypeError("question must be an object");
    if (typeof question.id !== "string" || question.id.length === 0 || question.id.length > MAX_ID_LENGTH) {
      throw new TypeError(`question id must be 1-${MAX_ID_LENGTH} characters`);
    }
    if (ids.has(question.id)) throw new TypeError(`duplicate question id: ${question.id}`);
    ids.add(question.id);

    if (typeof question.correctAnswer !== "string" || question.correctAnswer.length > MAX_ANSWER_LENGTH) {
      throw new TypeError(`correct answer must be at most ${MAX_ANSWER_LENGTH} characters`);
    }
    if (!Number.isFinite(question.points) || question.points <= 0 || question.points > 10_000) {
      throw new TypeError("question points must be a finite number between 0 and 10000");
    }
    return { ...question };
  });

  const passingPercent = assessment.passingPercent ?? 70;
  if (!Number.isFinite(passingPercent) || passingPercent < 0 || passingPercent > 100) {
    throw new TypeError("passingPercent must be between 0 and 100");
  }

  return { questions, passingPercent };
}

function validateSubmission(submission: Submission, questions: Question[]): void {
  if (typeof submission !== "object" || submission === null || typeof submission.answers !== "object" || submission.answers === null || Array.isArray(submission.answers)) {
    throw new TypeError("submission.answers must be an object");
  }

  const allowed = new Set(questions.map((question) => question.id));
  for (const [id, answer] of Object.entries(submission.answers)) {
    if (!allowed.has(id)) throw new TypeError(`unknown question id: ${id}`);
    if (typeof answer !== "string" || answer.length > MAX_ANSWER_LENGTH) {
      throw new TypeError(`answer must be at most ${MAX_ANSWER_LENGTH} characters`);
    }
  }
}
