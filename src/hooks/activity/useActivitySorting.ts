
import { useMemo } from 'react';
import { format } from 'date-fns';
import { Activity } from '@/types/history';

interface UseActivitySortingProps {
  activities: Activity[];
  sortOrder: string;
}

export const useActivitySorting = ({ activities, sortOrder }: UseActivitySortingProps) => {
  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.date.getTime() - a.date.getTime();
      } else {
        return a.date.getTime() - b.date.getTime();
      }
    });
  }, [activities, sortOrder]);

  const groupedActivities = useMemo(() => {
    const grouped: Record<string, Activity[]> = {};
    
    sortedActivities.forEach(activity => {
      const dateKey = format(activity.date, 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
    });
    
    return grouped;
  }, [sortedActivities]);

  return { sortedActivities, groupedActivities };
};
