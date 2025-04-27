
import { useQuery } from '@tanstack/react-query';
import { DocumentMetrics, TimeRange } from '@/types/statistics';
import { useGlobalState } from '../useGlobalState';

export function useDocumentMetrics(timeRange: TimeRange) {
  const { queryKeys, handleError } = useGlobalState();

  return useQuery({
    queryKey: [...queryKeys.statistics.documentMetrics, timeRange],
    queryFn: async (): Promise<DocumentMetrics> => {
      return {
        totalDocuments: Math.round(150 + Math.random() * 50),
        averageDocumentsPerCase: Number((3 + Math.random() * 2).toFixed(1)),
        documentTypes: [
          { type: 'Petições', count: Math.round(50 + Math.random() * 20) },
          { type: 'Contratos', count: Math.round(30 + Math.random() * 15) },
          { type: 'Procurações', count: Math.round(20 + Math.random() * 10) },
          { type: 'Pareceres', count: Math.round(25 + Math.random() * 15) },
          { type: 'Outros', count: Math.round(25 + Math.random() * 15) }
        ],
        averageProcessingTime: Math.round(15 + Math.random() * 10)
      };
    },
    staleTime: 5 * 60 * 1000,
    meta: {
      onError: (error) => handleError(error, 'Falha ao carregar métricas de documentos')
    }
  });
}

