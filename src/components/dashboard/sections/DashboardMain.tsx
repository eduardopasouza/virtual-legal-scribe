
import React from 'react';
import { WebChat } from '@/components/WebChat';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OngoingActivities } from '@/components/dashboard/OngoingActivities';
import { SystemGuide } from '@/components/dashboard/SystemGuide';
import { CasesSummary } from './CasesSummary';

interface DashboardMainProps {
  cases: any[];
  isLoading: boolean;
}

export function DashboardMain({ cases, isLoading }: DashboardMainProps) {
  // Filter cases by status
  const activeCases = cases?.filter(c => c.status === 'em_andamento') || [];
  const completedCases = cases?.filter(c => c.status === 'concluido') || [];
  const archivedCases = cases?.filter(c => c.status === 'arquivado') || [];

  return (
    <div className="lg:col-span-2 space-y-4 lg:space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Assistente EVJI</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] p-0">
          <WebChat fullScreen={false} />
        </CardContent>
      </Card>
      
      <CasesSummary 
        activeCases={activeCases}
        completedCases={completedCases}
        archivedCases={archivedCases}
        isLoading={isLoading}
      />
      
      <OngoingActivities />
      <SystemGuide />
    </div>
  );
}
