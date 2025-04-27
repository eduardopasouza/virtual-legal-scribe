
import { useMemo } from 'react';
import { Activity } from '@/types/history';

interface UseActivityFiltersProps {
  activities: Activity[];
  searchTerm: string;
  dateFilter: string;
  typeFilter: string;
}

export const useActivityFilters = ({
  activities,
  searchTerm,
  dateFilter,
  typeFilter
}: UseActivityFiltersProps) => {
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesAction = activity.action.toLowerCase().includes(searchLower);
        const matchesAgent = activity.agent.toLowerCase().includes(searchLower);
        const matchesCase = activity.caseName?.toLowerCase().includes(searchLower);
        const matchesDetails = activity.details?.toLowerCase().includes(searchLower);
        
        if (!(matchesAction || matchesAgent || matchesCase || matchesDetails)) {
          return false;
        }
      }
      
      // Date filter
      if (dateFilter !== 'all') {
        const now = new Date();
        if (dateFilter === 'today') {
          const isToday = activity.date.getDate() === now.getDate() && 
                         activity.date.getMonth() === now.getMonth() && 
                         activity.date.getFullYear() === now.getFullYear();
          if (!isToday) return false;
        } else if (dateFilter === 'week') {
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (activity.date < oneWeekAgo) return false;
        } else if (dateFilter === 'month') {
          const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          if (activity.date < oneMonthAgo) return false;
        } else if (dateFilter === 'quarter') {
          const oneQuarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          if (activity.date < oneQuarterAgo) return false;
        }
      }
      
      // Type filter
      if (typeFilter !== 'all' && activity.type !== typeFilter) {
        return false;
      }
      
      return true;
    });
  }, [activities, searchTerm, dateFilter, typeFilter]);

  return filteredActivities;
};
