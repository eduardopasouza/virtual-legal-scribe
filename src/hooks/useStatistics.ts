
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  CaseMetrics, 
  AgentMetrics, 
  ClientMetrics, 
  DocumentMetrics,
  AreaMetrics,
  WorkflowMetrics,
  TimeSeriesData,
  TimeRange,
  CategoryData
} from '@/types/statistics';
import { useGlobalState } from './useGlobalState';
import { supabase } from '@/integrations/supabase/client';
import { useCases } from './useCases';
import { useClients } from './useClients';

// Mock data generator functions
const generateTimeSeriesData = (days: number, baseValue: number, volatility: number): TimeSeriesData[] => {
  const result: TimeSeriesData[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
    const value = Math.round(baseValue * randomFactor);
    
    result.push({
      date: date.toISOString().split('T')[0],
      value
    });
  }
  
  return result;
};

export function useStatistics(timeRange: TimeRange = 'month') {
  const { queryKeys, handleError } = useGlobalState();
  const { cases, stats: caseStats } = useCases();
  const { clients, stats: clientStats } = useClients();
  const [isLoaded, setIsLoaded] = useState(false);

  // In a real implementation, these would be fetched from Supabase
  // For now, we'll use mock data based on the cases and clients data
  
  // Case metrics based on days range
  const daysMap: Record<TimeRange, number> = {
    week: 7,
    month: 30,
    quarter: 90,
    year: 365,
    all: 730
  };
  
  const days = daysMap[timeRange];
  
  // Case metrics query
  const { data: caseMetrics } = useQuery({
    queryKey: [...queryKeys.statistics.caseMetrics, timeRange],
    queryFn: async (): Promise<CaseMetrics> => {
      // In a real implementation, fetch from Supabase
      // For now, return mock data based on the cases data
      return {
        totalCases: caseStats?.total || 0,
        activeCases: caseStats?.active || 0,
        completedCases: caseStats?.completed || 0,
        archivedCases: caseStats?.archived || 0,
        averageResolutionTime: Math.round(15 + Math.random() * 10),
        successRate: Math.round(75 + Math.random() * 15)
      };
    },
    enabled: !!caseStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (error) => handleError(error, 'Falha ao carregar métricas de casos')
    }
  });

  // Agent performance query
  const { data: agentMetrics } = useQuery({
    queryKey: [...queryKeys.statistics.agentMetrics, timeRange],
    queryFn: async (): Promise<AgentMetrics[]> => {
      // In a real implementation, fetch from Supabase
      return [
        { 
          agentName: 'Recepcionista', 
          casesProcessed: 42, 
          averageProcessingTime: 1.2,
          accuracyRate: 95,
          utilizationRate: 78
        },
        { 
          agentName: 'Analisador', 
          casesProcessed: 38, 
          averageProcessingTime: 2.5,
          accuracyRate: 92,
          utilizationRate: 82
        },
        { 
          agentName: 'Estrategista', 
          casesProcessed: 35, 
          averageProcessingTime: 3.1,
          accuracyRate: 89,
          utilizationRate: 76
        },
        { 
          agentName: 'Pesquisador', 
          casesProcessed: 32, 
          averageProcessingTime: 2.8,
          accuracyRate: 94,
          utilizationRate: 85
        },
        { 
          agentName: 'Redator', 
          casesProcessed: 28, 
          averageProcessingTime: 4.2,
          accuracyRate: 91,
          utilizationRate: 80
        },
        { 
          agentName: 'Revisor', 
          casesProcessed: 26, 
          averageProcessingTime: 1.9,
          accuracyRate: 97,
          utilizationRate: 74
        }
      ];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (error) => handleError(error, 'Falha ao carregar métricas de agentes')
    }
  });

  // Client metrics query
  const { data: clientMetrics } = useQuery({
    queryKey: [...queryKeys.statistics.clientMetrics, timeRange],
    queryFn: async (): Promise<ClientMetrics> => {
      // In a real implementation, fetch from Supabase
      return {
        totalClients: clientStats?.totalClients || 0,
        activeClients: clientStats?.activeClients || 0,
        inactiveClients: clientStats?.inactiveClients || 0,
        newClientsThisMonth: Math.round(5 + Math.random() * 8),
        averageCasesPerClient: clientStats?.totalClients ? 
          Number((clientStats.totalCases / clientStats.totalClients).toFixed(1)) : 0,
        clientRetentionRate: Math.round(80 + Math.random() * 15)
      };
    },
    enabled: !!clientStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (error) => handleError(error, 'Falha ao carregar métricas de clientes')
    }
  });

  // Document metrics query
  const { data: documentMetrics } = useQuery({
    queryKey: [...queryKeys.statistics.documentMetrics, timeRange],
    queryFn: async (): Promise<DocumentMetrics> => {
      // In a real implementation, fetch from Supabase
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (error) => handleError(error, 'Falha ao carregar métricas de documentos')
    }
  });

  // Area metrics query
  const { data: areaMetrics } = useQuery({
    queryKey: [...queryKeys.statistics.areaMetrics, timeRange],
    queryFn: async (): Promise<AreaMetrics[]> => {
      // In a real implementation, fetch from Supabase
      return [
        { 
          area: 'Cível', 
          caseCount: Math.round(35 + Math.random() * 15), 
          successRate: Math.round(75 + Math.random() * 15),
          averageResolutionTime: Math.round(20 + Math.random() * 10)
        },
        { 
          area: 'Trabalhista', 
          caseCount: Math.round(25 + Math.random() * 10), 
          successRate: Math.round(80 + Math.random() * 10),
          averageResolutionTime: Math.round(15 + Math.random() * 8)
        },
        { 
          area: 'Tributário', 
          caseCount: Math.round(18 + Math.random() * 7), 
          successRate: Math.round(70 + Math.random() * 20),
          averageResolutionTime: Math.round(25 + Math.random() * 15)
        },
        { 
          area: 'Penal', 
          caseCount: Math.round(12 + Math.random() * 6), 
          successRate: Math.round(65 + Math.random() * 15),
          averageResolutionTime: Math.round(30 + Math.random() * 20)
        },
        { 
          area: 'Administrativo', 
          caseCount: Math.round(10 + Math.random() * 5), 
          successRate: Math.round(85 + Math.random() * 10),
          averageResolutionTime: Math.round(18 + Math.random() * 7)
        }
      ];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (error) => handleError(error, 'Falha ao carregar métricas por área')
    }
  });

  // Workflow metrics query
  const { data: workflowMetrics } = useQuery({
    queryKey: [...queryKeys.statistics.workflowMetrics, timeRange],
    queryFn: async (): Promise<WorkflowMetrics[]> => {
      // In a real implementation, fetch from Supabase
      return [
        { 
          stageName: 'Recepção', 
          averageTimeSpent: 0.5 + Math.random() * 0.5,
          bottleneckFrequency: Math.round(5 + Math.random() * 5)
        },
        { 
          stageName: 'Análise', 
          averageTimeSpent: 1.0 + Math.random() * 1.0,
          bottleneckFrequency: Math.round(15 + Math.random() * 10)
        },
        { 
          stageName: 'Estratégia', 
          averageTimeSpent: 1.5 + Math.random() * 1.0,
          bottleneckFrequency: Math.round(20 + Math.random() * 15)
        },
        { 
          stageName: 'Pesquisa', 
          averageTimeSpent: 2.0 + Math.random() * 2.0,
          bottleneckFrequency: Math.round(25 + Math.random() * 15)
        },
        { 
          stageName: 'Redação', 
          averageTimeSpent: 3.0 + Math.random() * 2.0,
          bottleneckFrequency: Math.round(30 + Math.random() * 15)
        },
        { 
          stageName: 'Revisão', 
          averageTimeSpent: 1.0 + Math.random() * 0.5,
          bottleneckFrequency: Math.round(10 + Math.random() * 10)
        }
      ];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (error) => handleError(error, 'Falha ao carregar métricas de fluxo de trabalho')
    }
  });

  // Time series data
  const { data: casesOverTime } = useQuery({
    queryKey: [...queryKeys.statistics.timeSeriesData, 'cases', timeRange],
    queryFn: async (): Promise<TimeSeriesData[]> => {
      return generateTimeSeriesData(days, 3, 0.3);
    },
    staleTime: 5 * 60 * 1000,
    meta: {
      onError: (error) => handleError(error, 'Falha ao carregar dados de série temporal')
    }
  });

  const { data: completionTimeOverTime } = useQuery({
    queryKey: [...queryKeys.statistics.timeSeriesData, 'completionTime', timeRange],
    queryFn: async (): Promise<TimeSeriesData[]> => {
      return generateTimeSeriesData(days, 15, 0.2);
    },
    staleTime: 5 * 60 * 1000
  });

  const { data: successRateOverTime } = useQuery({
    queryKey: [...queryKeys.statistics.timeSeriesData, 'successRate', timeRange],
    queryFn: async (): Promise<TimeSeriesData[]> => {
      return generateTimeSeriesData(days, 85, 0.1);
    },
    staleTime: 5 * 60 * 1000
  });

  // On component mount, set the loaded state after a brief delay (for UX)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return {
    isLoaded,
    caseMetrics,
    agentMetrics,
    clientMetrics,
    documentMetrics,
    areaMetrics,
    workflowMetrics,
    casesOverTime,
    completionTimeOverTime,
    successRateOverTime,
  };
}
