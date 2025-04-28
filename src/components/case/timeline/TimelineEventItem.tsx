
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TimelineEvent } from "@/hooks/useTimelineEvents";
import { TimelineStatusBadge } from "./TimelineStatusBadge";

interface TimelineEventItemProps {
  event: TimelineEvent;
  isLastInGroup: boolean;
}

export function TimelineEventItem({ event, isLastInGroup }: TimelineEventItemProps) {
  // Use the LucideIcon directly
  const Icon = event.icon;

  return (
    <div className="relative pl-6">
      <div className={`absolute left-0 top-2 w-3 h-3 rounded-full ${event.color}`} />
      
      {!isLastInGroup && (
        <div className="absolute left-[5px] top-5 bottom-0 w-0.5 bg-border h-full" />
      )}
      
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="font-medium flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{event.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <TimelineStatusBadge event={event} />
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
  );
}
