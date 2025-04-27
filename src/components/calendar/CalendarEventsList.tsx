
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from '@/types/calendar';
import { UpcomingEvents } from './UpcomingEvents';
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";

interface CalendarEventsListProps {
  events: Event[];
  onAddEvent: () => void;
  title?: string;
}

export function CalendarEventsList({ events, onAddEvent, title = "Próximos Eventos" }: CalendarEventsListProps) {
  const sortedEvents = [...events]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .filter(event => new Date(event.date) >= new Date());

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <Button size="sm" variant="outline" onClick={onAddEvent}>
            <CalendarPlus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-270px)]">
          <UpcomingEvents events={sortedEvents} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
