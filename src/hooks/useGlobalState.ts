
import { useQueryClient } from '@tanstack/react-query';
import { handleError } from '@/utils/errorHandling';

// Query keys constants for better maintainability
const queryKeys = {
  cases: {
    all: 'cases',
    lists: () => [...queryKeys.cases.all, 'list'],
    list: (filters: string) => [...queryKeys.cases.lists(), { filters }],
    details: () => [...queryKeys.cases.all, 'detail'],
    byId: (id: string) => [...queryKeys.cases.details(), id],
  },
  activities: {
    all: (caseId: string) => ['activities', caseId],
    byId: (caseId: string, activityId: string) => ['activities', caseId, activityId],
  },
  documents: {
    all: 'documents',
    byCaseId: (caseId: string) => ['documents', caseId],
  },
  workflow: {
    all: 'workflow',
    stages: (caseId: string) => ['workflow_stages', caseId],
  },
  alerts: {
    all: 'alerts',
    byCaseId: (caseId: string) => ['alerts', caseId],
  }
};

export function useGlobalState() {
  const queryClient = useQueryClient();
  
  return {
    queryClient,
    queryKeys,
    handleError: (error: any, context?: string) => {
      return handleError(error, undefined, { context: context || 'Operação' });
    }
  };
}
