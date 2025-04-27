
import { useQuery } from '@tanstack/react-query';
import { WorkflowMetrics, TimeRange } from '@/types/statistics';
import { useGlobalState } from '../useGlobalState';

export function useWorkflowMetrics(timeRange: TimeRange) {
  const { queryKeys, handleError } = useGlobalState();

  return useQuery({
    queryKey: [...queryKeys.statistics.workflowMetrics, timeRange],
    queryFn: async (): Promise<WorkflowMetrics[]> => {
      return [
        { 
          stageName: 'Recepção', 
          averageTimeSpent: 0.5 + Math.random() * 0.5,
          bottleneckFrequency: Math.round(5 + Math.random() * 5)
        },
        { 
          stageName: 'Análise', 
          averageTimeSpent: 1.0 + Math.random() * 1.0,
          bottleneckFrequency: Math.round(15 + Math.random() * 10)
        },
        { 
          stageName: 'Estratégia', 
          averageTimeSpent: 1.5 + Math.random() * 1.0,
          bottleneckFrequency: Math.round(20 + Math.random() * 15)
        },
        { 
          stageName: 'Pesquisa', 
          averageTimeSpent: 2.0 + Math.random() * 2.0,
          bottleneckFrequency: Math.round(25 + Math.random() * 15)
        },
        { 
          stageName: 'Redação', 
          averageTimeSpent: 3.0 + Math.random() * 2.0,
          bottleneckFrequency: Math.round(30 + Math.random() * 15)
        },
        { 
          stageName: 'Revisão', 
          averageTimeSpent: 1.0 + Math.random() * 0.5,
          bottleneckFrequency: Math.round(10 + Math.random() * 10)
        }
      ];
    },
    staleTime: 5 * 60 * 1000,
    meta: {
      onError: (error) => handleError(error, 'Falha ao carregar métricas de fluxo de trabalho')
    }
  });
}

