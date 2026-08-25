# Security and Student-Data Boundary

Sky Assessment Core is an engineering-beta scoring library. It has no network server, authentication system, database, student identity store, proctoring system, or credential issuer.

Do not include passwords, access tokens, private keys, unnecessary personal data, medical/accommodation details, or regulated student records in question IDs or answers. Applications using this library are responsible for authentication, authorization, tenant isolation, transport security, data minimization, retention/deletion, consent, auditing, accessibility, and applicable education/privacy requirements.

Assessment definitions and answer keys are sensitive application content even when they are not personal data. Consumer applications should restrict access to correct answers and avoid sending answer keys to untrusted clients when that would compromise an assessment.

Input bounds reduce accidental misuse but are not a denial-of-service defense for hostile public traffic. CI verifies compilation, deterministic scoring tests, dependency audit, and package creation; these checks are not a security, accessibility, accreditation, or compliance certification.
