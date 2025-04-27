
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Case } from '@/types/case';
import { useGlobalState } from './useGlobalState';

export function useSingleCase(id?: string) {
  const { queryClient, queryKeys, handleError } = useGlobalState();

  const { data: caseData, isLoading } = useQuery({
    queryKey: queryKeys.cases.byId(id || ''),
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Case;
    },
    enabled: !!id,
    meta: {
      onError: handleError
    }
  });

  const createCase = useMutation({
    mutationFn: async (newCase: Omit<Case, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('cases')
        .insert(newCase)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cases.all });
    },
    onError: handleError
  });

  return { caseData, isLoading, createCase };
}
