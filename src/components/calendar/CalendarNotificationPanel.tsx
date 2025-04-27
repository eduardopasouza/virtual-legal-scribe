
import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { Event } from '@/types/calendar';

interface CalendarNotificationPanelProps {
  events: Event[];
  onDismiss: (eventId: string) => void;
}

export function CalendarNotificationPanel({ events, onDismiss }: CalendarNotificationPanelProps) {
  const pendingEvents = events.filter(event => !event.notificationSettings?.notified);

  if (pendingEvents.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4 border-l-4 border-l-blue-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          Notificações do Calendário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {pendingEvents.map((event) => (
              <div 
                key={event.id} 
                className="p-3 bg-background rounded-lg border relative"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6"
                  onClick={() => onDismiss(event.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <h4 className="font-medium text-sm pr-8">{event.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {event.description}
                </p>
                <div className="text-xs text-muted-foreground mt-2">
                  {new Date(event.date).toLocaleDateString()} - {event.startTime}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
