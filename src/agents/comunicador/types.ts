
export interface ClientCommunication {
  documentSummary: string;
  keyPoints: string[];
  simplifiedExplanation: string;
  anticipatedQuestions: {
    question: string;
    answer: string;
  }[];
  technicalTermsExplained: {
    term: string;
    explanation: string;
  }[];
}

export interface FeedbackItem {
  type: 'confusion' | 'correction' | 'question' | 'approval';
  content: string;
  timestamp: Date;
  resolved: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface CommunicationResult {
  summary: ClientCommunication;
  clientReady: boolean;
  feedbackCollected: FeedbackItem[];
  presentationFormat: 'document' | 'slides' | 'qa' | 'email';
}
