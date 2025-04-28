
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Alert, Deadline } from "@/types/case";
import { DocumentMetadata } from "@/types/document";
import { Info } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTimelineEvents } from "@/hooks/useTimelineEvents";
import { TimelineEventItem } from "./timeline/TimelineEventItem";

interface CaseProceduralTimelineProps {
  activities: Activity[];
  deadlines: Deadline[];
  documents: DocumentMetadata[];
  alerts: Alert[];
}

export function CaseProceduralTimeline({ 
  activities, 
  deadlines, 
  documents, 
  alerts 
}: CaseProceduralTimelineProps) {
  const { getFilteredEvents, groupEventsByMonth } = useTimelineEvents(
    activities,
    deadlines,
    documents,
    alerts
  );
  
  const groupedEvents = groupEventsByMonth(getFilteredEvents('all'));
  const monthKeys = Object.keys(groupedEvents);

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          Movimentação Processual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="activity">Atividades</TabsTrigger>
            <TabsTrigger value="document">Documentos</TabsTrigger>
            <TabsTrigger value="deadline">Prazos</TabsTrigger>
            <TabsTrigger value="alert">Alertas</TabsTrigger>
          </TabsList>
          
          {['all', 'activity', 'document', 'deadline', 'alert'].map(tabValue => (
            <TabsContent key={tabValue} value={tabValue}>
              {monthKeys.length > 0 ? (
                <div className="space-y-6">
                  {monthKeys.map(monthYear => {
                    const monthEvents = groupedEvents[monthYear].filter(event => 
                      tabValue === 'all' || event.type === tabValue
                    );
                    
                    if (monthEvents.length === 0) return null;
                    
                    return (
                      <div key={monthYear}>
                        <h3 className="text-lg font-medium mb-4 text-primary-foreground">
                          {monthYear}
                        </h3>
                        <div className="relative space-y-6">
                          {monthEvents.map((event, index) => (
                            <TimelineEventItem
                              key={event.id}
                              event={event}
                              isLastInGroup={index === monthEvents.length - 1}
                            />
                          ))}
                        </div>
                        <Separator className="mt-6" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Nenhum evento encontrado.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
