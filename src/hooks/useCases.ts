
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Case } from '@/types/case';
import { useGlobalState } from './useGlobalState';

export function useCases() {
  const { queryKeys, handleError } = useGlobalState();

  const { data: cases, isLoading } = useQuery({
    queryKey: queryKeys.cases.all,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Case[];
    },
    meta: {
      onError: handleError
    }
  });

  const stats = {
    total: cases?.length ?? 0,
    active: cases?.filter(c => c.status === 'em_andamento').length ?? 0,
    completed: cases?.filter(c => c.status === 'concluido').length ?? 0,
    archived: cases?.filter(c => c.status === 'arquivado').length ?? 0
  };

  return { cases, stats, isLoading };
}
