# SkyCredentials — Wave 2 Slot #116

**Lane:** 02  
**Status:** engineering beta / education credential-record core.

SkyCredentials records bounded credential metadata after caller-supplied passing assessment evidence. It is designed to integrate with the existing Sky Assessment Core without claiming accreditation, certificate signing, identity verification, or external issuance.

## Integration contract

A typical local composition is:

`assessment definition + learner submission -> gradeAssessment() -> passing result -> CredentialRegistry.record()`

The registry requires evidence with `passed: true` and a bounded percentage. It stores the referenced assessment ID alongside learner/course/title/timestamp metadata.

Every record explicitly reports:

- `externalCredentialIssued: false`
- `authorityVerificationPerformed: false`

Those fields prevent a local metadata record from being misrepresented as an externally issued or institutionally verified credential.

## Bounds and invariants

- at most 10,000 records per registry instance;
- credential, learner, course, and assessment IDs are bounded safe identifiers;
- titles are 1–160 characters;
- issuance timestamps must be non-negative safe integers;
- evidence percentages must be 0–100 and represent a passed assessment;
- duplicate credential IDs are rejected;
- returned records are defensive snapshots.

## Explicit limitations

SkyCredentials does not authenticate learners, verify course completion outside caller-supplied evidence, sign certificates, generate PDFs, publish badges, anchor records on-chain, validate accreditation, contact schools/employers, provide revocation registries, persist records durably, or establish production deployment.

A production credential service would additionally require authenticated identity, durable storage, issuer authority controls, revocation/correction workflows, privacy governance, auditability, cryptographic signing where appropriate, and independent legal/institutional review.
