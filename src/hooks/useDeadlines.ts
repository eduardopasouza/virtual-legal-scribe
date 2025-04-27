import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Deadline } from '@/types/case';

export function useDeadlines(caseId?: string) {
  const queryClient = useQueryClient();

  const { data: deadlines, isLoading } = useQuery({
    queryKey: ['deadlines', caseId],
    queryFn: async () => {
      if (!caseId) return [];
      const { data, error } = await supabase
        .from('deadlines')
        .select('*')
        .eq('case_id', caseId)
        .order('date', { ascending: true });

      if (error) throw error;
      return data as Deadline[];
    },
    enabled: !!caseId
  });

  const createDeadline = useMutation({
    mutationFn: async (newDeadline: Omit<Deadline, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('deadlines')
        .insert(newDeadline)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines', caseId] });
    }
  });

  return { deadlines, isLoading, createDeadline };
}
