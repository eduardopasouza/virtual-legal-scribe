
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Activity, Alert, Deadline } from "@/types/case";
import { AlertTriangle, Calendar, Clock, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CaseEventsTimelineProps {
  activities: Activity[];
  deadlines: Deadline[];
  alerts: Alert[];
}

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: 'activity' | 'alert' | 'deadline';
  status?: string;
  priority?: string;
}

export function CaseEventsTimeline({ activities, deadlines, alerts }: CaseEventsTimelineProps) {
  // Convert activities, alerts, and deadlines into a unified timeline
  const allEvents: TimelineEvent[] = [
    ...activities.map((activity): TimelineEvent => ({
      id: activity.id,
      title: `${activity.agent}: ${activity.action}`,
      description: activity.result,
      date: new Date(activity.created_at),
      type: 'activity',
      status: activity.status
    })),
    ...alerts.map((alert): TimelineEvent => ({
      id: alert.id,
      title: alert.title,
      description: alert.description,
      date: new Date(alert.created_at || new Date()),
      type: 'alert',
      status: alert.status,
      priority: alert.priority
    })),
    ...deadlines.map((deadline): TimelineEvent => ({
      id: deadline.id,
      title: deadline.description,
      date: new Date(deadline.date),
      type: 'deadline',
      status: deadline.status
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Filter events by type
  const getFilteredEvents = (type: 'activity' | 'alert' | 'deadline' | 'all') => {
    if (type === 'all') return allEvents;
    return allEvents.filter(event => event.type === type);
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'activity':
        return <MessageSquare className="h-4 w-4" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4" />;
      case 'deadline':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (event: TimelineEvent) => {
    if (!event.status) return null;
    
    let color = "";
    let text = event.status;
    
    switch (event.type) {
      case 'activity':
        color = event.status === 'concluido' ? 'bg-green-500' : 
                event.status === 'erro' ? 'bg-red-500' : 
                event.status === 'em_processamento' ? 'bg-blue-500' : 'bg-amber-500';
        break;
      case 'alert':
        color = event.status === 'resolved' ? 'bg-green-500' : 'bg-red-500';
        text = event.status === 'resolved' ? 'Resolvido' : 'Pendente';
        break;
      case 'deadline':
        color = event.status === 'concluido' ? 'bg-green-500' : 
                event.status === 'atrasado' ? 'bg-red-500' : 'bg-amber-500';
        text = event.status === 'concluido' ? 'Concluído' : 
               event.status === 'atrasado' ? 'Atrasado' : 'Pendente';
        break;
    }
    
    return <Badge className={color}>{text}</Badge>;
  };

  const renderEvent = (event: TimelineEvent) => (
    <div key={event.id} className="relative pl-6 pb-8 last:pb-0">
      <div className={`absolute left-0 top-2 w-3 h-3 rounded-full 
        ${event.type === 'activity' ? 'bg-blue-500' : 
          event.type === 'alert' ? 'bg-red-500' : 'bg-amber-500'}`}>
      </div>
      <div className="absolute left-[5px] top-5 bottom-0 w-0.5 bg-border"></div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="font-medium flex items-center gap-2">
            {getEventIcon(event.type)}
            <span>{event.title}</span>
          </div>
          {getStatusBadge(event)}
        </div>
        {event.description && (
          <p className="text-sm">{event.description}</p>
        )}
        <p className="text-xs text-muted-foreground">
          {format(event.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </p>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Linha do Tempo de Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="activity">Atividades</TabsTrigger>
            <TabsTrigger value="alert">Alertas</TabsTrigger>
            <TabsTrigger value="deadline">Prazos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {allEvents.length > 0 ? (
              <div className="space-y-4">{allEvents.map(renderEvent)}</div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                Nenhum evento encontrado.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="activity">
            {getFilteredEvents('activity').length > 0 ? (
              <div className="space-y-4">{getFilteredEvents('activity').map(renderEvent)}</div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                Nenhuma atividade encontrada.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="alert">
            {getFilteredEvents('alert').length > 0 ? (
              <div className="space-y-4">{getFilteredEvents('alert').map(renderEvent)}</div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                Nenhum alerta encontrado.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="deadline">
            {getFilteredEvents('deadline').length > 0 ? (
              <div className="space-y-4">{getFilteredEvents('deadline').map(renderEvent)}</div>
            ) : (
              <div className="text-center p-6 text-muted-foreground">
                Nenhum prazo encontrado.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
