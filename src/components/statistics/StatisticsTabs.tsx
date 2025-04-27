
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileBarChart } from 'lucide-react';
import { TimeSeriesData, AreaMetrics, DocumentMetrics, AgentMetrics, WorkflowMetrics } from '@/types/statistics';
import { GeneralOverviewTab } from './tabs/GeneralOverviewTab';
import { CasesAnalysisTab } from './tabs/CasesAnalysisTab';
import { AgentsAnalysisTab } from './tabs/AgentsAnalysisTab';
import { TimeAnalysisTab } from './tabs/TimeAnalysisTab';

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

      <TabsContent value="geral">
        <GeneralOverviewTab
          casesOverTime={casesOverTime}
          completionTimeOverTime={completionTimeOverTime}
          successRateOverTime={successRateOverTime}
          areaMetrics={areaMetrics}
          documentMetrics={documentMetrics}
          agentMetrics={agentMetrics}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="casos">
        <CasesAnalysisTab
          areaMetrics={areaMetrics}
          documentMetrics={documentMetrics}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="agentes">
        <AgentsAnalysisTab
          agentMetrics={agentMetrics}
          workflowMetrics={workflowMetrics}
          isLoading={isLoading}
        />
      </TabsContent>

      <TabsContent value="tempo">
        <TimeAnalysisTab
          completionTimeOverTime={completionTimeOverTime}
          successRateOverTime={successRateOverTime}
          workflowMetrics={workflowMetrics}
          isLoading={isLoading}
        />
      </TabsContent>
    </Tabs>
  );
};
