
import { useQuery } from '@tanstack/react-query';
import { ClientMetrics, TimeRange } from '@/types/statistics';
import { useGlobalState } from '../useGlobalState';

export function useClientMetrics(timeRange: TimeRange, clientStats: any) {
  const { queryKeys, handleError } = useGlobalState();

  return useQuery({
    queryKey: [...queryKeys.statistics.clientMetrics, timeRange],
    queryFn: async (): Promise<ClientMetrics> => {
      return {
        totalClients: clientStats?.totalClients || 0,
        activeClients: clientStats?.activeClients || 0,
        inactiveClients: clientStats?.inactiveClients || 0,
        newClientsThisMonth: Math.round(5 + Math.random() * 8),
        averageCasesPerClient: clientStats?.totalClients ? 
          Number((clientStats.totalCases / clientStats.totalClients).toFixed(1)) : 0,
        clientRetentionRate: Math.round(80 + Math.random() * 15)
      };
    },
    enabled: !!clientStats,
    staleTime: 5 * 60 * 1000,
    meta: {
      onError: (error) => handleError(error, 'Falha ao carregar métricas de clientes')
    }
  });
}

