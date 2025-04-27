
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Activity } from "@/types/case";

interface CaseActivitiesProps {
  activities: Activity[];
}

export function CaseActivities({ activities }: CaseActivitiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Histórico de Atividades</CardTitle>
        <CardDescription>
          Todas as ações realizadas pelos agentes neste caso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="relative pl-6 pb-8 last:pb-0">
              <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary"></div>
              <div className="absolute left-[5px] top-5 bottom-0 w-0.5 bg-border"></div>
              <div className="space-y-1">
                <div className="font-medium">{activity.agent}</div>
                <p className="text-sm">{activity.action}</p>
                {activity.created_at && (
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(activity.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
