
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PerformanceMetricsChart } from '../PerformanceMetricsChart';
import { WorkflowAnalysisChart } from '../WorkflowAnalysisChart';
import { TimeSeriesData, WorkflowMetrics } from '@/types/statistics';

interface TimeAnalysisTabProps {
  completionTimeOverTime?: TimeSeriesData[];
  successRateOverTime?: TimeSeriesData[];
  workflowMetrics?: WorkflowMetrics[];
  isLoading: boolean;
}

export const TimeAnalysisTab = ({
  completionTimeOverTime,
  successRateOverTime,
  workflowMetrics,
  isLoading
}: TimeAnalysisTabProps) => {
  return (
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
  );
};
