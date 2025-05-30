
export interface VerificationCriteria {
  formalRequirements: boolean;
  legalCompliance: boolean;
  citations: boolean;
  logicalCoherence: boolean;
  alignmentWithObjectives: boolean;
}

export interface VerificationResult {
  criteria: VerificationCriteria;
  recommendations: string[];
  issuesFound: string[];
}

export interface DocumentToVerify {
  id?: string;
  type: string;
  title?: string;
  content: string;
}

export interface RevisionResult {
  originalContent: string;
  revisedContent: string;
  changesMade: string[];
  improvementsDescription: string;
  readabilityScore: number;
  technicalAccuracyPreserved: boolean;
}
