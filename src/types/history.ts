
export type ActivityType = 'document' | 'case' | 'system' | 'deadline';

export interface Activity {
  id: string;
  type: ActivityType;
  action: string;
  agent: string;
  caseId?: string;
  caseName?: string;
  date: Date;
  details?: string;
}

export interface ActivityFilter {
  search: string;
  date: string;
  type: string;
  sort: string;
}
