
import React from 'react';
import { CasesOverTimeChart } from '../CasesOverTimeChart';
import { PerformanceMetricsChart } from '../PerformanceMetricsChart';
import { AreaDistributionChart } from '../AreaDistributionChart';
import { DocumentMetricsCard } from '../documents/DocumentMetricsCard';
import { AgentPerformanceChart } from '../AgentPerformanceChart';
import { TimeSeriesData, AreaMetrics, DocumentMetrics, AgentMetrics } from '@/types/statistics';

interface GeneralOverviewTabProps {
  casesOverTime?: TimeSeriesData[];
  completionTimeOverTime?: TimeSeriesData[];
  successRateOverTime?: TimeSeriesData[];
  areaMetrics?: AreaMetrics[];
  documentMetrics?: DocumentMetrics;
  agentMetrics?: AgentMetrics[];
  isLoading: boolean;
}

export const GeneralOverviewTab = ({
  casesOverTime,
  completionTimeOverTime,
  successRateOverTime,
  areaMetrics,
  documentMetrics,
  agentMetrics,
  isLoading
}: GeneralOverviewTabProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};
