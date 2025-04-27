
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, queryKeys } from '@/lib/react-query/queryClient';
import { toast } from 'sonner';

export function useGlobalState() {
  // Função helper para invalidar queries relacionadas
  const invalidateRelatedQueries = (caseId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.cases.byId(caseId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.workflow.stages(caseId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.activities.all(caseId) });
  };

  // Função helper para mostrar toast de erro
  const handleError = (error: Error) => {
    toast.error(error.message || 'Ocorreu um erro inesperado');
  };

  return {
    invalidateRelatedQueries,
    handleError,
    queryClient,
    queryKeys,
  };
}
