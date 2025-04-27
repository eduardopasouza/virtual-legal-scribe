import { useQueryClient } from '@tanstack/react-query';
import { handleError } from '@/utils/errorHandling';

/**
 * Estrutura centralizada de query keys para cache e invalidação.
 * Organizada hierarquicamente por domínio (casos, atividades, etc.)
 * 
 * Exemplo de uso:
 * queryKeys.cases.byId('123') -> ['cases', 'detail', '123']
 * queryKeys.activities.all('456') -> ['activities', '456']
 */
const queryKeys = {
  cases: {
    all: ['cases'],
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
    all: ['documents'],
    byCaseId: (caseId: string) => ['documents', caseId],
  },
  workflow: {
    all: ['workflow'],
    stages: (caseId: string) => ['workflow_stages', caseId],
  },
  alerts: {
    all: ['alerts'],
    byCaseId: (caseId: string) => ['alerts', caseId],
  },
  statistics: {
    caseMetrics: ['statistics', 'case-metrics'],
    agentMetrics: ['statistics', 'agent-metrics'],
    clientMetrics: ['statistics', 'client-metrics'],
    documentMetrics: ['statistics', 'document-metrics'],
    areaMetrics: ['statistics', 'area-metrics'],
    workflowMetrics: ['statistics', 'workflow-metrics'],
    timeSeriesData: ['statistics', 'time-series'],
  }
};

/**
 * Hook para gerenciamento de estado global da aplicação.
 * Fornece acesso ao queryClient do React Query e funções utilitárias.
 * 
 * @returns {Object} Objeto com utilidades para gerenciamento de estado
 * @property {QueryClient} queryClient - Cliente React Query para gerenciamento de cache
 * @property {Object} queryKeys - Estrutura de chaves para queries
 * @property {Function} handleError - Função para tratamento padronizado de erros
 */
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
