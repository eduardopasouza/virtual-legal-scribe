
export interface PerformanceMetric {
  period: string;
  value: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
}

export interface CaseMetrics {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  archivedCases: number;
  averageResolutionTime: number; // in days
  successRate: number; // percentage
}

export interface AgentMetrics {
  agentName: string;
  casesProcessed: number;
  averageProcessingTime: number; // in hours
  accuracyRate: number; // percentage
  utilizationRate: number; // percentage
}

export interface ClientMetrics {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  newClientsThisMonth: number;
  averageCasesPerClient: number;
  clientRetentionRate: number; // percentage
}

export interface DocumentMetrics {
  totalDocuments: number;
  averageDocumentsPerCase: number;
  documentTypes: { type: string; count: number }[];
  averageProcessingTime: number; // in seconds
}

export interface AreaMetrics {
  area: string;
  caseCount: number;
  successRate: number;
  averageResolutionTime: number; // in days
}

export interface WorkflowMetrics {
  stageName: string;
  averageTimeSpent: number; // in hours
  bottleneckFrequency: number; // percentage
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface CategoryData {
  category: string;
  value: number;
}

export type TimeRange = 'week' | 'month' | 'quarter' | 'year' | 'all';
export type MetricGranularity = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
