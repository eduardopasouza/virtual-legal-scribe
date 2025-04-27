
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, FileText } from 'lucide-react';
import { ActivityTimeline } from '@/components/history/ActivityTimeline';
import { ActivityList } from '@/components/history/ActivityList';
import { ActivityHistorySkeleton } from './ActivityHistorySkeleton';
import type { Activity } from '@/types/history';

interface ActivityHistoryContentProps {
  isLoading: boolean;
  groupedActivities: Record<string, Activity[]>;
  activities: Activity[];
  onViewDetails: (activity: Activity) => void;
}

export function ActivityHistoryContent({
  isLoading,
  groupedActivities,
  activities,
  onViewDetails
}: ActivityHistoryContentProps) {
  return (
    <Tabs defaultValue="timeline">
      <TabsList>
        <TabsTrigger value="timeline">
          <Clock className="h-4 w-4 mr-2" />
          Linha do Tempo
        </TabsTrigger>
        <TabsTrigger value="list">
          <FileText className="h-4 w-4 mr-2" />
          Lista
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="timeline" className="mt-6">
        {isLoading ? (
          <ActivityHistorySkeleton type="timeline" />
        ) : (
          <ActivityTimeline 
            activities={groupedActivities}
            onViewDetails={onViewDetails}
          />
        )}
      </TabsContent>
      
      <TabsContent value="list" className="mt-6">
        {isLoading ? (
          <ActivityHistorySkeleton type="list" />
        ) : (
          <ActivityList 
            activities={activities}
            onViewDetails={onViewDetails}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
