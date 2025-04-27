
import { TimeSeriesData } from '@/types/statistics';

export const generateTimeSeriesData = (days: number, baseValue: number, volatility: number): TimeSeriesData[] => {
  const result: TimeSeriesData[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
    const value = Math.round(baseValue * randomFactor);
    
    result.push({
      date: date.toISOString().split('T')[0],
      value
    });
  }
  
  return result;
};

