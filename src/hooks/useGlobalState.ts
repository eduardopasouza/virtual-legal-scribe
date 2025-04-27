
import { queryClient, queryKeys } from '@/lib/react-query/queryClient';
import { toast } from 'sonner';

export function useGlobalState() {
  // Helper function to invalidate related queries
  const invalidateRelatedQueries = (caseId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.cases.byId(caseId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.workflow.stages(caseId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.activities.all(caseId) });
  };

  // Helper function to show toast error - this will be used in the onError callbacks
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
