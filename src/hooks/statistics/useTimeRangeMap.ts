
import { TimeRange } from '@/types/statistics';

export const useTimeRangeMap = () => {
  const daysMap: Record<TimeRange, number> = {
    week: 7,
    month: 30,
    quarter: 90,
    year: 365,
    all: 730
  };

  return { daysMap };
};

