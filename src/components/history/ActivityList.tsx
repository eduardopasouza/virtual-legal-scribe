
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ActivityItem } from './ActivityItem';
import { EmptyState } from './EmptyState';
import { Activity } from '@/types/history';

interface ActivityListProps {
  activities: Activity[];
  onViewDetails?: (activity: Activity) => void;
}

export function ActivityList({ activities, onViewDetails }: ActivityListProps) {
  if (activities.length === 0) {
    return <EmptyState type="list" />;
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {activities.map(activity => (
            <ActivityItem 
              key={activity.id} 
              activity={activity} 
              variant="list"
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
