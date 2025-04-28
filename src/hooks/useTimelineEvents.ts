
import { Activity, Alert, Deadline } from "@/types/case";
import { DocumentMetadata } from "@/types/document";
import { ReactNode } from 'react';
import { FileText, Clock, Calendar, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type: 'activity' | 'document' | 'deadline' | 'alert';
  status?: string;
  priority?: string;
  icon: ReactNode;
  color: string;
}

export function useTimelineEvents(
  activities: Activity[],
  deadlines: Deadline[],
  documents: DocumentMetadata[],
  alerts: Alert[]
) {
  const allEvents: TimelineEvent[] = [
    ...activities.map((activity): TimelineEvent => ({
      id: activity.id,
      title: activity.action,
      description: activity.result || `Realizado por: ${activity.agent}`,
      date: new Date(activity.created_at),
      type: 'activity',
      status: activity.status,
      icon: { type: Clock, props: { className: "h-4 w-4" } },
      color: 'bg-blue-500'
    })),
    ...documents.map((doc): TimelineEvent => ({
      id: doc.id || `doc-${doc.name}`,
      title: `Documento: ${doc.name}`,
      description: doc.document_type ? `Tipo: ${doc.document_type}` : `Tipo: Não especificado`,
      date: new Date(doc.uploaded_at || new Date()),
      type: 'document',
      status: doc.processed_status,
      icon: { type: FileText, props: { className: "h-4 w-4" } },
      color: 'bg-green-500'
    })),
    ...deadlines.map((deadline): TimelineEvent => ({
      id: deadline.id,
      title: `Prazo: ${deadline.description}`,
      date: new Date(deadline.date),
      type: 'deadline',
      status: deadline.status,
      icon: { type: Calendar, props: { className: "h-4 w-4" } },
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
      icon: { type: AlertTriangle, props: { className: "h-4 w-4" } },
      color: 'bg-red-500'
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const getFilteredEvents = (type: 'activity' | 'document' | 'deadline' | 'alert' | 'all') => {
    if (type === 'all') return allEvents;
    return allEvents.filter(event => event.type === type);
  };

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

  return {
    allEvents,
    getFilteredEvents,
    groupEventsByMonth
  };
}
