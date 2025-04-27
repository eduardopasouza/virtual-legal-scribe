
export interface LegalIssue {
  id: number;
  issue: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  relatedFacts: string[];
}

export interface Argument {
  argument: string;
  strength: 'weak' | 'medium' | 'strong';
  supportingEvidence?: string[];
  counterEvidence?: string[];
}

export interface ArgumentsAnalysisData {
  plaintiffArguments: Argument[];
  defendantArguments: Argument[];
  keyDisputes: string[];
}

export interface StrategyData {
  mainThesis: string;
  objectives: string[];
  risks: string[];
  recommendations: string[];
  currentPhase: 'initial' | 'intermediate' | 'final';
}

export interface RulesData {
  relevantLegislation: {
    name: string;
    articles: string[];
  }[];
  jurisprudence: string[];
  doctrines: string[];
}
