
import React from 'react';
import { FileText, CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import type { Event } from '@/types/calendar';
import { getTypeColor, getTypeLabel } from '@/utils/calendar';

interface UpcomingEventsProps {
  events: Event[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-2">
      {upcomingEvents.length === 0 ? (
        <div className="text-sm text-muted-foreground italic">
          Não há eventos próximos.
        </div>
      ) : (
        upcomingEvents.map(event => (
          <div key={event.id} className="flex items-start gap-3 p-2 border rounded-md hover:bg-muted/50 transition-colors">
            <div className={`w-1 self-stretch rounded-full ${getTypeColor(event.type)}`} />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{event.title}</div>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                  {format(event.date, 'dd/MM/yyyy')}
                </div>
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {event.startTime} - {event.endTime}
                </div>
              </div>
              {event.relatedCase && (
                <div className="flex items-center gap-1 mt-1 text-xs">
                  <FileText className="h-3 w-3" />
                  {event.relatedCase}
                </div>
              )}
            </div>
            <Badge className={cn(
              'text-xs',
              getTypeColor(event.type).replace('bg-', 'bg-opacity-20 text-').replace('-500', '-700')
            )}>
              {getTypeLabel(event.type)}
            </Badge>
          </div>
        ))
      )}
    </div>
  );
}
