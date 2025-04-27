
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { toast } from "sonner";
import { TimeRange } from '@/types/statistics';
import { useStatistics } from '@/hooks/useStatistics';

// Statistics components
import { StatisticsHeader } from '@/components/statistics/StatisticsHeader';
import { MetricsGrid } from '@/components/statistics/MetricsGrid';
import { CasesOverTimeChart } from '@/components/statistics/CasesOverTimeChart';
import { AreaDistributionChart } from '@/components/statistics/AreaDistributionChart';
import { AgentPerformanceChart } from '@/components/statistics/AgentPerformanceChart';
import { WorkflowAnalysisChart } from '@/components/statistics/WorkflowAnalysisChart';
import { PerformanceMetricsChart } from '@/components/statistics/PerformanceMetricsChart';
import { DocumentAnalyticsCard } from '@/components/statistics/DocumentAnalyticsCard';
import { AgentAccuracyChart } from '@/components/statistics/AgentAccuracyChart';

// Create a more professional statistics page
const Statistics = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  
  const {
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
  } = useStatistics(timeRange);

  const handleExport = () => {
    toast.success("Estatísticas exportadas com sucesso", {
      description: "O arquivo foi salvo na pasta de downloads."
    });
  };

  const handleRangeChange = (range: TimeRange) => {
    setTimeRange(range);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <StatisticsHeader 
          selectedRange={timeRange}
          onRangeChange={handleRangeChange}
          onExport={handleExport}
        />
        
        {/* Key metrics overview */}
        <MetricsGrid 
          caseMetrics={caseMetrics} 
          clientMetrics={clientMetrics}
          isLoading={!isLoaded}
        />
        
        {/* Main charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CasesOverTimeChart data={casesOverTime} isLoading={!isLoaded} />
          <PerformanceMetricsChart 
            completionTimeData={completionTimeOverTime}
            successRateData={successRateOverTime}
            isLoading={!isLoaded}
          />
        </div>
        
        {/* Second level analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AreaDistributionChart data={areaMetrics} isLoading={!isLoaded} />
          <DocumentAnalyticsCard data={documentMetrics} isLoading={!isLoaded} />
        </div>
        
        {/* Agent performance and workflow analysis */}
        <div className="grid grid-cols-1 gap-6">
          <AgentPerformanceChart data={agentMetrics} isLoading={!isLoaded} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AgentAccuracyChart data={agentMetrics} isLoading={!isLoaded} />
          <WorkflowAnalysisChart data={workflowMetrics} isLoading={!isLoaded} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Statistics;
