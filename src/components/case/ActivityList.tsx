
import React, { useMemo } from 'react';
import { Activity } from '@/types/case';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActivityListProps {
  activities: Activity[];
  isLoading: boolean;
}

export const ActivityList = React.memo(({ activities, isLoading }: ActivityListProps) => {
  const formattedActivities = useMemo(() => 
    activities.map(activity => ({
      ...activity,
      formattedDate: format(
        new Date(activity.created_at), 
        "dd/MM/yyyy 'às' HH:mm", 
        { locale: ptBR }
      )
    })),
    [activities]
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-evji-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Carregando atividades...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Atividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4">
            <p className="text-muted-foreground">Nenhuma atividade registrada.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Atividades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {formattedActivities.map((activity) => (
            <div key={activity.id} className="relative pl-6 pb-8 last:pb-0">
              <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary"></div>
              <div className="absolute left-[5px] top-5 bottom-0 w-0.5 bg-border"></div>
              <div className="space-y-1">
                <div className="font-medium">{activity.agent}</div>
                <p className="text-sm">{activity.action}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.formattedDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

ActivityList.displayName = 'ActivityList';

