
// Renamed to be consistent with collection naming
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Activity } from '@/types/case';
import { useGlobalState } from './useGlobalState';

export function useActivitiesList(caseId?: string) {
  const { queryClient, queryKeys, handleError } = useGlobalState();

  const { data: activities, isLoading } = useQuery({
    queryKey: queryKeys.activities.all(caseId || ''),
    queryFn: async () => {
      if (!caseId) return [];
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Activity[];
    },
    enabled: !!caseId,
    meta: {
      onError: handleError
    }
  });

  const createActivity = useMutation({
    mutationFn: async (newActivity: Omit<Activity, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('activities')
        .insert(newActivity)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      if (caseId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.activities.all(caseId) });
      }
    },
    onError: handleError
  });

  return { activities, isLoading, createActivity };
}
