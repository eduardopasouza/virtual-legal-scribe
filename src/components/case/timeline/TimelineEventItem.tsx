
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TimelineEvent } from "@/hooks/useTimelineEvents";
import { TimelineStatusBadge } from "./TimelineStatusBadge";
import { createElement } from "react";

interface TimelineEventItemProps {
  event: TimelineEvent;
  isLastInGroup: boolean;
}

export function TimelineEventItem({ event, isLastInGroup }: TimelineEventItemProps) {
  // Render the icon by creating the element from the type and props
  const renderIcon = () => {
    if (event.icon && typeof event.icon === 'object' && 'type' in event.icon) {
      return createElement(event.icon.type, event.icon.props);
    }
    return null;
  };

  return (
    <div className="relative pl-6">
      <div className={`absolute left-0 top-2 w-3 h-3 rounded-full ${event.color}`} />
      
      {!isLastInGroup && (
        <div className="absolute left-[5px] top-5 bottom-0 w-0.5 bg-border h-full" />
      )}
      
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="font-medium flex items-center gap-2">
            {renderIcon()}
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
