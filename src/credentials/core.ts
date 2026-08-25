const SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const MAX_RECORDS = 10_000;

export interface CredentialEvidence {
  assessmentId: string;
  passed: boolean;
  percentage: number;
}

export interface CredentialInput {
  id: string;
  learnerId: string;
  courseId: string;
  title: string;
  issuedAt: number;
  evidence: CredentialEvidence;
}

export interface CredentialRecord {
  readonly id: string;
  readonly learnerId: string;
  readonly courseId: string;
  readonly title: string;
  readonly issuedAt: number;
  readonly evidence: Readonly<CredentialEvidence>;
  readonly status: 'recorded';
  readonly externalCredentialIssued: false;
  readonly authorityVerificationPerformed: false;
}

function normalizeId(name: string, value: string): string {
  const normalized = value.trim();
  if (!SAFE_ID.test(normalized)) throw new TypeError(`${name} must be 1-128 safe characters`);
  return normalized;
}

function normalizeTitle(value: string): string {
  const normalized = value.trim();
  if (normalized.length < 1 || normalized.length > 160) {
    throw new TypeError('title must be 1-160 characters');
  }
  return normalized;
}

function normalizeEvidence(evidence: CredentialEvidence): CredentialEvidence {
  const assessmentId = normalizeId('assessmentId', evidence.assessmentId);
  if (typeof evidence.passed !== 'boolean') throw new TypeError('passed must be boolean');
  if (!Number.isFinite(evidence.percentage) || evidence.percentage < 0 || evidence.percentage > 100) {
    throw new TypeError('percentage must be between 0 and 100');
  }
  if (!evidence.passed) throw new Error('credential evidence must represent a passed assessment');
  return { assessmentId, passed: true, percentage: evidence.percentage };
}

function clone(record: CredentialRecord): CredentialRecord {
  return { ...record, evidence: { ...record.evidence } };
}

/**
 * Records credential metadata after caller-supplied passing evidence.
 * It does not sign, publish, accredit, or independently verify a credential.
 */
export class CredentialRegistry {
  private readonly records = new Map<string, CredentialRecord>();

  record(input: CredentialInput): CredentialRecord {
    if (this.records.size >= MAX_RECORDS) throw new RangeError(`credential capacity cannot exceed ${MAX_RECORDS}`);
    const id = normalizeId('id', input.id);
    if (this.records.has(id)) throw new Error('credential id already exists');
    if (!Number.isSafeInteger(input.issuedAt) || input.issuedAt < 0) {
      throw new TypeError('issuedAt must be a non-negative safe integer');
    }
    const record: CredentialRecord = {
      id,
      learnerId: normalizeId('learnerId', input.learnerId),
      courseId: normalizeId('courseId', input.courseId),
      title: normalizeTitle(input.title),
      issuedAt: input.issuedAt,
      evidence: normalizeEvidence(input.evidence),
      status: 'recorded',
      externalCredentialIssued: false,
      authorityVerificationPerformed: false,
    };
    this.records.set(id, record);
    return clone(record);
  }

  get(id: string): CredentialRecord | undefined {
    const value = this.records.get(normalizeId('id', id));
    return value ? clone(value) : undefined;
  }

  listForLearner(learnerId: string): CredentialRecord[] {
    const normalized = normalizeId('learnerId', learnerId);
    return [...this.records.values()]
      .filter((record) => record.learnerId === normalized)
      .sort((a, b) => a.issuedAt - b.issuedAt || a.id.localeCompare(b.id))
      .map(clone);
  }
}
