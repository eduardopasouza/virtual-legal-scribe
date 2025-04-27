
import { useState, useEffect } from 'react';
import { TimeRange } from '@/types/statistics';
import { useCases } from './useCases';
import { useClients } from './useClients';
import { useCaseMetrics } from './statistics/useCaseMetrics';
import { useAgentMetrics } from './statistics/useAgentMetrics';
import { useClientMetrics } from './statistics/useClientMetrics';
import { useTimeSeriesMetrics } from './statistics/useTimeSeriesMetrics';
import { useDocumentMetrics } from './statistics/useDocumentMetrics';
import { useAreaMetrics } from './statistics/useAreaMetrics';
import { useWorkflowMetrics } from './statistics/useWorkflowMetrics';

export function useStatistics(timeRange: TimeRange = 'month') {
  const [isLoaded, setIsLoaded] = useState(false);
  const { cases, stats: caseStats } = useCases();
  const { clients, stats: clientStats } = useClients();

  const { data: caseMetrics } = useCaseMetrics(timeRange, caseStats);
  const { data: agentMetrics } = useAgentMetrics(timeRange);
  const { data: clientMetrics } = useClientMetrics(timeRange, clientStats);
  const { data: documentMetrics } = useDocumentMetrics(timeRange);
  const { data: areaMetrics } = useAreaMetrics(timeRange);
  const { data: workflowMetrics } = useWorkflowMetrics(timeRange);
  const { casesOverTime, completionTimeOverTime, successRateOverTime } = useTimeSeriesMetrics(timeRange);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return {
    isLoaded,
    caseMetrics,
    agentMetrics,
    clientMetrics,
    documentMetrics,
    areaMetrics,
    workflowMetrics,
    casesOverTime,
    completionTimeOverTime,
    successRateOverTime,
  };
}

