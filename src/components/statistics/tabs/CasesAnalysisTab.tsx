
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaDistributionChart } from '../AreaDistributionChart';
import { DocumentMetricsCard } from '../documents/DocumentMetricsCard';
import { AreaMetrics, DocumentMetrics } from '@/types/statistics';

interface CasesAnalysisTabProps {
  areaMetrics?: AreaMetrics[];
  documentMetrics?: DocumentMetrics;
  isLoading: boolean;
}

export const CasesAnalysisTab = ({
  areaMetrics,
  documentMetrics,
  isLoading
}: CasesAnalysisTabProps) => {
  return (
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
  );
};
