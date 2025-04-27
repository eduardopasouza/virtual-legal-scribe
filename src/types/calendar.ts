
export interface Event {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'audiencia' | 'prazo' | 'reuniao' | 'outro';
  description: string;
  relatedCase?: string;
  notes?: string;
  feedback?: {
    comment: string;
    timestamp: Date;
    status: 'pending' | 'reviewed' | 'addressed';
  }[];
  activitySummary?: string;
}
