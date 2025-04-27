
import { useQuery } from '@tanstack/react-query';
import { AgentMetrics, TimeRange } from '@/types/statistics';
import { useGlobalState } from '../useGlobalState';

export function useAgentMetrics(timeRange: TimeRange) {
  const { queryKeys, handleError } = useGlobalState();

  return useQuery({
    queryKey: [...queryKeys.statistics.agentMetrics, timeRange],
    queryFn: async (): Promise<AgentMetrics[]> => {
      return [
        { 
          agentName: 'Recepcionista', 
          casesProcessed: 42, 
          averageProcessingTime: 1.2,
          accuracyRate: 95,
          utilizationRate: 78
        },
        { 
          agentName: 'Analisador', 
          casesProcessed: 38, 
          averageProcessingTime: 2.5,
          accuracyRate: 92,
          utilizationRate: 82
        },
        { 
          agentName: 'Estrategista', 
          casesProcessed: 35, 
          averageProcessingTime: 3.1,
          accuracyRate: 89,
          utilizationRate: 76
        },
        { 
          agentName: 'Pesquisador', 
          casesProcessed: 32, 
          averageProcessingTime: 2.8,
          accuracyRate: 94,
          utilizationRate: 85
        },
        { 
          agentName: 'Redator', 
          casesProcessed: 28, 
          averageProcessingTime: 4.2,
          accuracyRate: 91,
          utilizationRate: 80
        },
        { 
          agentName: 'Revisor', 
          casesProcessed: 26, 
          averageProcessingTime: 1.9,
          accuracyRate: 97,
          utilizationRate: 74
        }
      ];
    },
    staleTime: 5 * 60 * 1000,
    meta: {
      onError: (error) => handleError(error, 'Falha ao carregar métricas de agentes')
    }
  });
}

