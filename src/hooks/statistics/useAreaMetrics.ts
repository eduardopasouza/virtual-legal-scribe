
import { useQuery } from '@tanstack/react-query';
import { AreaMetrics, TimeRange } from '@/types/statistics';
import { useGlobalState } from '../useGlobalState';

export function useAreaMetrics(timeRange: TimeRange) {
  const { queryKeys, handleError } = useGlobalState();

  return useQuery({
    queryKey: [...queryKeys.statistics.areaMetrics, timeRange],
    queryFn: async (): Promise<AreaMetrics[]> => {
      return [
        { 
          area: 'Cível', 
          caseCount: Math.round(35 + Math.random() * 15), 
          successRate: Math.round(75 + Math.random() * 15),
          averageResolutionTime: Math.round(20 + Math.random() * 10)
        },
        { 
          area: 'Trabalhista', 
          caseCount: Math.round(25 + Math.random() * 10), 
          successRate: Math.round(80 + Math.random() * 10),
          averageResolutionTime: Math.round(15 + Math.random() * 8)
        },
        { 
          area: 'Tributário', 
          caseCount: Math.round(18 + Math.random() * 7), 
          successRate: Math.round(70 + Math.random() * 20),
          averageResolutionTime: Math.round(25 + Math.random() * 15)
        },
        { 
          area: 'Penal', 
          caseCount: Math.round(12 + Math.random() * 6), 
          successRate: Math.round(65 + Math.random() * 15),
          averageResolutionTime: Math.round(30 + Math.random() * 20)
        },
        { 
          area: 'Administrativo', 
          caseCount: Math.round(10 + Math.random() * 5), 
          successRate: Math.round(85 + Math.random() * 10),
          averageResolutionTime: Math.round(18 + Math.random() * 7)
        }
      ];
    },
    staleTime: 5 * 60 * 1000,
    meta: {
      onError: (error) => handleError(error, 'Falha ao carregar métricas por área')
    }
  });
}

