
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { toast } from "sonner";
import { TimeRange } from '@/types/statistics';
import { useStatistics } from '@/hooks/useStatistics';

import { StatisticsHeader } from '@/components/statistics/StatisticsHeader';
import { MetricsGrid } from '@/components/statistics/MetricsGrid';
import { StatisticsTabs } from '@/components/statistics/StatisticsTabs';

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
      <div className="p-6 space-y-6 h-full overflow-auto">
        <StatisticsHeader 
          selectedRange={timeRange}
          onRangeChange={handleRangeChange}
          onExport={handleExport}
        />
        
        <MetricsGrid 
          caseMetrics={caseMetrics} 
          clientMetrics={clientMetrics}
          isLoading={!isLoaded}
        />
        
        <StatisticsTabs
          casesOverTime={casesOverTime}
          completionTimeOverTime={completionTimeOverTime}
          successRateOverTime={successRateOverTime}
          areaMetrics={areaMetrics}
          documentMetrics={documentMetrics}
          agentMetrics={agentMetrics}
          workflowMetrics={workflowMetrics}
          isLoading={!isLoaded}
        />
      </div>
    </DashboardLayout>
  );
};

export default Statistics;
