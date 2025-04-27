
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityItem } from './ActivityItem';
import { EmptyState } from './EmptyState';
import { Activity } from '@/types/history';

interface ActivityTimelineProps {
  activities: Record<string, Activity[]>;
  onViewDetails?: (activity: Activity) => void;
}

export function ActivityTimeline({ activities, onViewDetails }: ActivityTimelineProps) {
  const dateKeys = Object.keys(activities);
  
  if (dateKeys.length === 0) {
    return <EmptyState type="timeline" />;
  }
  
  return (
    <div className="space-y-8">
      {dateKeys.map((dateKey) => (
        <div key={dateKey}>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-border"></div>
            <h3 className="text-sm font-medium">
              {format(new Date(dateKey), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h3>
            <div className="h-px flex-1 bg-border"></div>
          </div>
          
          <div className="space-y-6">
            {activities[dateKey].map((activity) => (
              <ActivityItem 
                key={activity.id} 
                activity={activity} 
                variant="timeline"
                onViewDetails={onViewDetails} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
