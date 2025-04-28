
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Activity, Alert, Deadline } from "@/types/case";
import { DocumentMetadata } from "@/types/document"; // Fixed import
import { AlertTriangle, Calendar, Clock, FileText, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CaseProceduralTimelineProps {
  activities: Activity[];
  deadlines: Deadline[];
  documents: DocumentMetadata[];
  alerts: Alert[];
}

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: 'activity' | 'document' | 'deadline' | 'alert';
  status?: string;
  priority?: string;
  icon: React.ReactNode;
  color: string;
}

export function CaseProceduralTimeline({ 
  activities, 
  deadlines, 
  documents, 
  alerts 
}: CaseProceduralTimelineProps) {
  // Prepare all timeline events combined
  const allEvents: TimelineEvent[] = [
    ...activities.map((activity): TimelineEvent => ({
      id: activity.id,
      title: activity.action,
      description: activity.result || `Realizado por: ${activity.agent}`,
      date: new Date(activity.created_at),
      type: 'activity',
      status: activity.status,
      icon: <Clock className="h-4 w-4" />,
      color: 'bg-blue-500'
    })),
    ...documents.map((doc): TimelineEvent => ({
      id: doc.id || `doc-${doc.name}`,
      title: `Documento: ${doc.name}`,
      // Fix: Use the document_type as a description instead of accessing a non-existent description property
      description: doc.document_type ? `Tipo: ${doc.document_type}` : `Tipo: Não especificado`,
      date: new Date(doc.uploaded_at || new Date()),
      type: 'document',
      status: doc.processed_status,
      icon: <FileText className="h-4 w-4" />,
      color: 'bg-green-500'
    })),
    ...deadlines.map((deadline): TimelineEvent => ({
      id: deadline.id,
      title: `Prazo: ${deadline.description}`,
      date: new Date(deadline.date),
      type: 'deadline',
      status: deadline.status,
      icon: <Calendar className="h-4 w-4" />,
      color: 'bg-amber-500'
    })),
    ...alerts.map((alert): TimelineEvent => ({
      id: alert.id,
      title: alert.title,
      description: alert.description,
      date: new Date(alert.created_at || new Date()),
      type: 'alert',
      status: alert.status,
      priority: alert.priority,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: 'bg-red-500'
    }))
  ]
  // Sort all events by date, most recent first
  .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Filter events by type
  const getFilteredEvents = (type: 'activity' | 'document' | 'deadline' | 'alert' | 'all') => {
    if (type === 'all') return allEvents;
    return allEvents.filter(event => event.type === type);
  };

  // Group events by month & year for chronological display
  const groupEventsByMonth = (events: TimelineEvent[]) => {
    const grouped: Record<string, TimelineEvent[]> = {};
    
    events.forEach(event => {
      const monthYear = format(event.date, 'MMMM yyyy', { locale: ptBR });
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(event);
    });
    
    return grouped;
  };

  const groupedEvents = groupEventsByMonth(allEvents);
  const monthKeys = Object.keys(groupedEvents);

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
      case 'document':
        color = event.status === 'processed' ? 'bg-green-500' : 
                event.status === 'pending' ? 'bg-amber-500' : 'bg-red-500';
        text = event.status === 'processed' ? 'Processado' : 
               event.status === 'pending' ? 'Pendente' : 'Erro';
        break;
      case 'deadline':
        color = event.status === 'concluido' ? 'bg-green-500' : 
                event.status === 'atrasado' ? 'bg-red-500' : 'bg-amber-500';
        text = event.status === 'concluido' ? 'Concluído' : 
               event.status === 'atrasado' ? 'Atrasado' : 'Pendente';
        break;
      case 'alert':
        color = event.status === 'resolved' ? 'bg-green-500' : 'bg-red-500';
        text = event.status === 'resolved' ? 'Resolvido' : 'Pendente';
        break;
    }
    
    return <Badge className={color}>{text}</Badge>;
  };

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
                            <div key={event.id} className="relative pl-6">
                              <div className={`absolute left-0 top-2 w-3 h-3 rounded-full ${event.color}`} />
                              
                              {index < monthEvents.length - 1 && (
                                <div className="absolute left-[5px] top-5 bottom-0 w-0.5 bg-border h-full" />
                              )}
                              
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium flex items-center gap-2">
                                    {event.icon}
                                    <span>{event.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getStatusBadge(event)}
                                    <span className="text-xs text-muted-foreground">
                                      {format(event.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                    </span>
                                  </div>
                                </div>
                                
                                {event.description && (
                                  <p className="text-sm text-muted-foreground">{event.description}</p>
                                )}
                              </div>
                            </div>
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
