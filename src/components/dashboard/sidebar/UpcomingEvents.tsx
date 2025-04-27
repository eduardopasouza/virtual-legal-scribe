
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { format, isToday, addDays, isSameDay, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { getTypeColor } from '@/utils/calendar';
import { Skeleton } from "@/components/ui/skeleton";

export function UpcomingEvents() {
  const navigate = useNavigate();
  const { events, isLoading } = useCalendarEvents();
  
  // Filter for upcoming events (today and future)
  const today = new Date();
  const upcomingEvents = events
    .filter(event => !isBefore(new Date(event.date), today) || isToday(new Date(event.date)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const formatEventDate = (date: Date) => {
    if (isToday(date)) {
      return 'Hoje';
    } else if (isSameDay(date, addDays(today, 1))) {
      return 'Amanhã';
    } else {
      return format(date, 'dd/MM', { locale: ptBR });
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-evji-accent" />
            Compromissos Próximos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(3).fill(null).map((_, i) => (
              <div key={i} className="flex flex-col space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-evji-accent" />
          Compromissos Próximos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className={cn(
                  "border-l-2 pl-3 py-1",
                  isToday(new Date(event.date)) ? "border-evji-accent" : "border-gray-300"
                )}
              >
                <p className="font-medium">{event.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatEventDate(new Date(event.date))}, {event.startTime} 
                  {event.relatedCase && ` - Caso #${event.relatedCase}`}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Não há compromissos agendados próximos.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" onClick={() => navigate('/calendar')}>
          Ver calendário completo
        </Button>
      </CardFooter>
    </Card>
  );
}
