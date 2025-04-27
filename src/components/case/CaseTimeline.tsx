
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowStage } from '@/types/case';

interface CaseTimelineProps {
  stages: WorkflowStage[];
}

export const CaseTimeline = React.memo(({ stages }: CaseTimelineProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Timeline do Caso</CardTitle>
      </CardHeader>
      <CardContent>
        {stages && stages.length > 0 ? (
          <div className="space-y-4">
            {stages.map((stage) => (
              <div key={stage.id} className="flex items-start gap-2">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-primary"></div>
                <div>
                  <p className="font-medium">{stage.stage_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {stage.status === 'completed' ? 'Concluído' : 'Em andamento'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-6">
            Nenhuma etapa registrada.
          </p>
        )}
      </CardContent>
    </Card>
  );
});

CaseTimeline.displayName = 'CaseTimeline';
