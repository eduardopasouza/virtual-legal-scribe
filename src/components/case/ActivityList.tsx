
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import type { Activity } from '@/types/case';

interface ActivityListProps {
  activities: Activity[];
  isLoading: boolean;
}

export function ActivityList({ activities, isLoading }: ActivityListProps) {
  if (isLoading) {
    return (
      <div 
        className="flex flex-col items-center justify-center p-8 space-y-4"
        data-testid="activity-list-loading"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Carregando atividades...
        </p>
      </div>
    );
  }

  if (!activities.length) {
    return (
      <div className="text-center p-8">
        <p className="text-sm text-muted-foreground">
          Nenhuma atividade registrada ainda.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4" role="list">
      {activities.map((activity) => (
        <li 
          key={activity.id}
          className="bg-card rounded-lg p-4 shadow-sm border"
          role="listitem"
        >
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="font-medium">{activity.action}</p>
              <p className="text-sm text-muted-foreground">{activity.agent}</p>
            </div>
            <time className="text-sm text-muted-foreground">
              {format(new Date(activity.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </time>
          </div>
        </li>
      ))}
    </ul>
  );
}
