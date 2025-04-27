
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CalendarIcon, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import type { Event } from '@/types/calendar';
import { getTypeColor } from '@/utils/calendar';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: Date;
  events: Event[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onTodayClick: () => void;
  onDateClick: (date: Date) => void;
  onAddNote?: (date: Date, note: string) => void;
}

export function CalendarGrid({ 
  currentMonth, 
  selectedDate,
  events, 
  onPreviousMonth,
  onNextMonth,
  onTodayClick,
  onDateClick,
  onAddNote
}: CalendarGridProps) {
  const [noteText, setNoteText] = useState('');
  const { toast } = useToast();
  const today = new Date();
  const days = (() => {
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const daysArray = [];
    for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
      daysArray.push(new Date(day));
    }
    return daysArray;
  })();

  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  const getSummaryForDay = (date: Date) => {
    const dayEvents = getEventsForDay(date);
    if (dayEvents.length === 0) return null;
    
    return dayEvents.find(e => e.activitySummary)?.activitySummary || null;
  };
  
  const handleDayClick = (date: Date) => {
    onDateClick(date);
  };
  
  const handleAddNote = () => {
    if (!selectedDate || !noteText.trim()) return;
    
    if (onAddNote) {
      onAddNote(selectedDate, noteText);
      setNoteText('');
      toast({
        title: "Nota adicionada",
        description: "Sua anotação foi salva e será analisada pelo sistema."
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={onPreviousMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="sm" onClick={onTodayClick}>
            Hoje
          </Button>
          <Button variant="ghost" size="icon" onClick={onNextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="text-center text-xs font-medium p-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: days[0].getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square p-0.5" />
        ))}
        
        {days.map((day) => {
          const eventsForDay = getEventsForDay(day);
          const isToday = day.getDate() === today.getDate() && 
                        day.getMonth() === today.getMonth() && 
                        day.getFullYear() === today.getFullYear();
          const isSelected = selectedDate?.getTime() === day.getTime();
          const summary = getSummaryForDay(day);
          
          return (
            <div 
              key={day.toString()} 
              className={cn(
                "aspect-square p-0.5",
                isToday ? "bg-muted/50 rounded-sm" : ""
              )}
            >
              <div 
                className={cn(
                  "h-full rounded-sm cursor-pointer hover:bg-muted transition-colors p-1",
                  isSelected ? "bg-muted ring-1 ring-primary" : "",
                  isToday ? "font-bold" : ""
                )}
                onClick={() => handleDayClick(day)}
              >
                <div className="text-right text-xs">
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-0.5 mt-0.5">
                  {eventsForDay.slice(0, 2).map(event => (
                    <div 
                      key={event.id}
                      className="flex items-center space-x-0.5"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${getTypeColor(event.type)}`} />
                      <span className="text-xs truncate text-xs">{event.title}</span>
                    </div>
                  ))}
                  {eventsForDay.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{eventsForDay.length - 2} mais
                    </div>
                  )}
                  
                  {summary && (
                    <div className="text-xs italic text-muted-foreground mt-0.5 border-t border-dashed border-muted pt-0.5">
                      {summary.length > 15 ? `${summary.substring(0, 15)}...` : summary}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedDate && (
        <div className="mt-4 border rounded-md p-3 bg-muted/20">
          <h3 className="text-sm font-medium mb-2">
            {format(selectedDate, 'dd/MM/yyyy')} - Anotações
          </h3>
          
          <Textarea 
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Adicione anotações ou feedback para este dia..."
            className="min-h-[80px] text-sm mb-2"
          />
          
          <div className="flex justify-end">
            <Button 
              size="sm" 
              onClick={handleAddNote}
              disabled={!noteText.trim()}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Adicionar Nota
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
