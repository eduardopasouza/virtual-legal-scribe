
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import type { Event } from '@/types/calendar';
import { getTypeColor } from '@/utils/calendar';

interface CalendarGridProps {
  currentMonth: Date;
  days: Date[];
  today: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;
}

export function CalendarGrid({ 
  currentMonth, 
  days, 
  today, 
  events, 
  onDateClick,
  onNavigate
}: CalendarGridProps) {
  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onNavigate('prev')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onNavigate('today')}>
            Hoje
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onNavigate('next')}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 mt-4">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="text-center text-sm font-medium p-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: days[0].getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square p-1" />
        ))}
        
        {days.map((day) => {
          const eventsForDay = getEventsForDay(day);
          const isToday = day.getDate() === today.getDate() && 
                        day.getMonth() === today.getMonth() && 
                        day.getFullYear() === today.getFullYear();
          
          return (
            <div 
              key={day.toString()} 
              className={cn(
                "aspect-square p-1",
                isToday ? "bg-muted/50 rounded-md" : ""
              )}
              onClick={() => onDateClick(day)}
            >
              <div className={cn(
                "h-full rounded-md p-1 cursor-pointer hover:bg-muted transition-colors",
                isToday ? "font-bold" : ""
              )}>
                <div className="text-right text-sm p-1">
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1 mt-1">
                  {eventsForDay.slice(0, 2).map(event => (
                    <div 
                      key={event.id}
                      className="flex items-center space-x-1"
                    >
                      <div className={`w-2 h-2 rounded-full ${getTypeColor(event.type)}`} />
                      <span className="text-xs truncate">{event.title}</span>
                    </div>
                  ))}
                  {eventsForDay.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{eventsForDay.length - 2} mais
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
