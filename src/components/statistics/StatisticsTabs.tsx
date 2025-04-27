import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileBarChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CasesOverTimeChart } from './CasesOverTimeChart';
import { PerformanceMetricsChart } from './PerformanceMetricsChart';
import { AreaDistributionChart } from './AreaDistributionChart';
import { DocumentMetricsCard } from './documents/DocumentMetricsCard';
import { AgentPerformanceChart } from './AgentPerformanceChart';
import { AgentAccuracyChart } from './AgentAccuracyChart';
import { WorkflowAnalysisChart } from './WorkflowAnalysisChart';
import { TimeSeriesData, AreaMetrics, DocumentMetrics, AgentMetrics, WorkflowMetrics } from '@/types/statistics';

interface StatisticsTabsProps {
  casesOverTime?: TimeSeriesData[];
  completionTimeOverTime?: TimeSeriesData[];
  successRateOverTime?: TimeSeriesData[];
  areaMetrics?: AreaMetrics[];
  documentMetrics?: DocumentMetrics;
  agentMetrics?: AgentMetrics[];
  workflowMetrics?: WorkflowMetrics[];
  isLoading: boolean;
}

export const StatisticsTabs = ({
  casesOverTime,
  completionTimeOverTime,
  successRateOverTime,
  areaMetrics,
  documentMetrics,
  agentMetrics,
  workflowMetrics,
  isLoading
}: StatisticsTabsProps) => {
  return (
    <Tabs defaultValue="geral" className="space-y-4">
      <TabsList>
        <TabsTrigger value="geral">
          <FileBarChart className="h-4 w-4 mr-2" />
          Visão Geral
        </TabsTrigger>
        <TabsTrigger value="casos">Casos</TabsTrigger>
        <TabsTrigger value="agentes">Agentes</TabsTrigger>
        <TabsTrigger value="tempo">Tempo</TabsTrigger>
      </TabsList>

      <TabsContent value="geral" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CasesOverTimeChart data={casesOverTime} isLoading={isLoading} />
          <PerformanceMetricsChart
            completionTimeData={completionTimeOverTime}
            successRateData={successRateOverTime}
            isLoading={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AreaDistributionChart data={areaMetrics} isLoading={isLoading} />
          <DocumentMetricsCard data={documentMetrics} isLoading={isLoading} />
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <AgentPerformanceChart data={agentMetrics} isLoading={isLoading} />
        </div>
      </TabsContent>

      <TabsContent value="casos">
        <Card>
          <CardHeader>
            <CardTitle>Análise de Casos</CardTitle>
            <CardDescription>
              Detalhamento dos casos processados pelo EVJI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AreaDistributionChart data={areaMetrics} isLoading={isLoading} />
              <DocumentMetricsCard data={documentMetrics} isLoading={isLoading} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="agentes">
        <Card>
          <CardHeader>
            <CardTitle>Desempenho de Agentes</CardTitle>
            <CardDescription>
              Análise detalhada do desempenho de cada agente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AgentAccuracyChart data={agentMetrics} isLoading={isLoading} />
              <WorkflowAnalysisChart data={workflowMetrics} isLoading={isLoading} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tempo">
        <Card>
          <CardHeader>
            <CardTitle>Análise de Tempo</CardTitle>
            <CardDescription>
              Métricas de tempo de processamento de casos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PerformanceMetricsChart
                completionTimeData={completionTimeOverTime}
                successRateData={successRateOverTime}
                isLoading={isLoading}
              />
              <WorkflowAnalysisChart data={workflowMetrics} isLoading={isLoading} />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
