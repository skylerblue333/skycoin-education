# Changelog

## 1.0.0-beta.1 - 2026-08-25

- Replaced echo-only build/test/lint scripts with real TypeScript verification.
- Added a bounded deterministic assessment scoring engine with weighted points and pass thresholds.
- Added per-question, total-score, percentage, answered-count, and correct-count results.
- Added validation for duplicate IDs, invalid points/pass thresholds, unknown answers, and input bounds.
- Added real scoring and failure-mode tests.
- Added dependency audit and package-smoke CI on Node.js 22.
- Removed unsupported Docker/database/JWT deployment scaffolding.
- Added explicit student-data, answer-key, and integration security boundaries.

LMS behavior, student records, certificates, identity/proctoring, persistence, accreditation, and production deployment are not claimed.
