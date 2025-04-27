
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Activity } from '@/types/case';
import { useGlobalState } from './useGlobalState';

/**
 * Hook para gerenciamento de atividades de um caso.
 * Permite listar e criar novas atividades relacionadas a um caso específico.
 * 
 * @param {string} caseId - ID do caso para carregar atividades
 * @returns {Object} Objeto com dados e operações de atividades
 * @property {Activity[]} activities - Lista de atividades
 * @property {boolean} isLoading - Status de carregamento
 * @property {Function} createActivity - Função para criar nova atividade
 */
export function useActivitiesList(caseId?: string) {
  const { queryClient, queryKeys, handleError } = useGlobalState();

  /**
   * Query para carregar atividades do caso
   * Ordenadas por data de criação decrescente
   */
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
      onError: (error) => handleError(error, 'Falha ao carregar atividades')
    }
  });

  /**
   * Mutation para criar nova atividade
   * Invalida a query de lista de atividades após sucesso
   */
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
    onError: (error) => handleError(error, 'Falha ao registrar atividade')
  });

  return { activities, isLoading, createActivity };
}
