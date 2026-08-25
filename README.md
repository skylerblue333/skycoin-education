# Sky Assessment Core

A deterministic TypeScript assessment-scoring library for educational integrations in the SKYCOIN4444 portfolio.

**Status: engineering beta.** This repository does not claim to be an LMS, accredited school system, certification authority, deployed course platform, AI tutor, or production student-record service.

## Implemented behavior

`gradeAssessment()` validates a bounded assessment definition and grades a submission deterministically. It supports weighted question points, configurable passing percentage, unanswered questions, per-question results, total/earned points, percentage, answered count, and correct count.

```ts
import { gradeAssessment } from "skycoin4444-assessment-core";

const result = gradeAssessment(
  {
    passingPercent: 70,
    questions: [
      { id: "q1", correctAnswer: "A", points: 2 },
      { id: "q2", correctAnswer: "B", points: 3 },
    ],
  },
  { answers: { q1: "A", q2: "B" } },
);
```

Validation rejects empty/oversized assessments, duplicate question IDs, invalid point values, invalid pass thresholds, unknown submitted question IDs, and oversized answers.

## Verification

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm audit --audit-level=high
pnpm pack
```

GitHub Actions runs real typecheck, tests, dependency audit, and package-smoke verification on Node.js 22. Previous scripts that only echoed successful build/test/lint messages were removed.

There is intentionally no Docker or database deployment surface: the current product is a reusable library, not a web application.

## Scope and limitations

Scoring currently uses exact string answer equality. It does not implement question banks, randomized tests, partial credit, essay grading, identity/proctoring, accommodations, course enrollment, student records, certificates, credential signing, persistence, analytics, privacy workflows, or regulatory compliance.

Historical AI/security experiment files remain in the repository for history but are excluded from the supported package build.

For SkySchool or other SKYCOIN4444 education applications, consume this package through a stable assessment adapter and keep student identity, persistence, permissions, certification, and privacy controls in their appropriate service boundaries.

## License

MIT, subject to the checked-in license and applicable third-party licenses.
