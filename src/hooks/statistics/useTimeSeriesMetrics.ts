
import { useQuery } from '@tanstack/react-query';
import { TimeRange, TimeSeriesData } from '@/types/statistics';
import { useGlobalState } from '../useGlobalState';
import { generateTimeSeriesData } from '@/utils/statistics/mockDataGenerators';
import { useTimeRangeMap } from './useTimeRangeMap';

export function useTimeSeriesMetrics(timeRange: TimeRange) {
  const { queryKeys, handleError } = useGlobalState();
  const { daysMap } = useTimeRangeMap();
  const days = daysMap[timeRange];

  const casesOverTime = useQuery({
    queryKey: [...queryKeys.statistics.timeSeriesData, 'cases', timeRange],
    queryFn: async (): Promise<TimeSeriesData[]> => {
      return generateTimeSeriesData(days, 3, 0.3);
    },
    staleTime: 5 * 60 * 1000,
    meta: {
      onError: (error) => handleError(error, 'Falha ao carregar dados de série temporal')
    }
  });

  const completionTimeOverTime = useQuery({
    queryKey: [...queryKeys.statistics.timeSeriesData, 'completionTime', timeRange],
    queryFn: async (): Promise<TimeSeriesData[]> => {
      return generateTimeSeriesData(days, 15, 0.2);
    },
    staleTime: 5 * 60 * 1000
  });

  const successRateOverTime = useQuery({
    queryKey: [...queryKeys.statistics.timeSeriesData, 'successRate', timeRange],
    queryFn: async (): Promise<TimeSeriesData[]> => {
      return generateTimeSeriesData(days, 85, 0.1);
    },
    staleTime: 5 * 60 * 1000
  });

  return {
    casesOverTime: casesOverTime.data,
    completionTimeOverTime: completionTimeOverTime.data,
    successRateOverTime: successRateOverTime.data,
  };
}

