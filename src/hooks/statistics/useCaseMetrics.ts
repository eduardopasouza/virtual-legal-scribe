
import { useQuery } from '@tanstack/react-query';
import { CaseMetrics, TimeRange } from '@/types/statistics';
import { useGlobalState } from '../useGlobalState';

export function useCaseMetrics(timeRange: TimeRange, caseStats: any) {
  const { queryKeys, handleError } = useGlobalState();

  return useQuery({
    queryKey: [...queryKeys.statistics.caseMetrics, timeRange],
    queryFn: async (): Promise<CaseMetrics> => {
      return {
        totalCases: caseStats?.total || 0,
        activeCases: caseStats?.active || 0,
        completedCases: caseStats?.completed || 0,
        archivedCases: caseStats?.archived || 0,
        averageResolutionTime: Math.round(15 + Math.random() * 10),
        successRate: Math.round(75 + Math.random() * 15)
      };
    },
    enabled: !!caseStats,
    staleTime: 5 * 60 * 1000,
    meta: {
      onError: (error) => handleError(error, 'Falha ao carregar métricas de casos')
    }
  });
}

