
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Activity } from '@/types/case';
import { useNotifications } from '@/components/notification/NotificationSystem';

export function useActivities(caseId?: string) {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  const { data: activities, isLoading } = useQuery({
    queryKey: ['activities', caseId],
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

      addNotification(
        'info',
        'Nova atividade registrada',
        `A atividade "${newActivity.action}" foi registrada.`
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', caseId] });
    }
  });

  return { activities, isLoading, createActivity };
}
