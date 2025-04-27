
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Chaves de query centralizadas para evitar strings mágicas
export const queryKeys = {
  cases: {
    all: ['cases'] as const,
    byId: (id: string) => ['cases', id] as const,
    activities: (id: string) => ['cases', id, 'activities'] as const,
  },
  workflow: {
    stages: (caseId: string) => ['workflow_stages', caseId] as const,
    currentStage: (caseId: string) => ['current_stage', caseId] as const,
  },
  documents: {
    all: (caseId: string) => ['documents', caseId] as const,
    byId: (docId: string) => ['documents', 'detail', docId] as const,
  },
  activities: {
    all: (caseId: string) => ['activities', caseId] as const,
  },
} as const;
