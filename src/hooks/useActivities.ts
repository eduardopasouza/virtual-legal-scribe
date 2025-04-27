
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Activity } from '@/types/case';

export function useActivities(caseId?: string) {
  const queryClient = useQueryClient();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities', caseId],
    queryFn: async () => {
      if (!caseId) return [];
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Activity[];
    },
    enabled: !!caseId
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
      queryClient.invalidateQueries({ queryKey: ['activities', caseId] });
    }
  });

  return { activities, isLoading, createActivity };
}
