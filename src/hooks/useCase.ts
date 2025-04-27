
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Case } from '@/types/case';
import { useGlobalState } from './useGlobalState';

/**
 * Hook para gerenciamento de um caso jurídico específico.
 * Permite carregar detalhes do caso e criar novos casos.
 * 
 * @param {string} id - ID do caso a ser carregado
 * @returns {Object} Objeto com dados e operações do caso
 * @property {Case} caseData - Dados do caso
 * @property {boolean} isLoading - Status de carregamento
 * @property {Function} createCase - Função para criar novo caso
 */
export function useSingleCase(id?: string) {
  const { queryClient, queryKeys, handleError } = useGlobalState();

  /**
   * Query para carregar dados do caso
   * Ativa apenas quando um ID é fornecido
   */
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
      onError: (error) => handleError(error, 'Falha ao carregar detalhes do caso')
    }
  });

  /**
   * Mutation para criar novo caso
   * Invalida a query de lista de casos após sucesso
   */
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
    onError: (error) => handleError(error, 'Falha ao criar caso')
  });

  return { caseData, isLoading, createCase };
}
