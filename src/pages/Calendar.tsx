
import React, { useState } from 'react';
import { format, startOfToday, eachDayOfInterval, startOfMonth, endOfMonth, add } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { EventForm } from '@/components/calendar/EventForm';
import { UpcomingEvents } from '@/components/calendar/UpcomingEvents';
import type { Event } from '@/types/calendar';

// Mock initial events
const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Audiência de Conciliação',
    date: new Date(2024, 3, 15),
    startTime: '14:00',
    endTime: '15:00',
    type: 'audiencia',
    description: 'Audiência de conciliação no processo de Indenização',
    relatedCase: 'Processo nº 0123456-78.2024.8.26.0100'
  },
  {
    id: '2',
    title: 'Prazo para Contestação',
    date: new Date(2024, 3, 20),
    startTime: '23:59',
    endTime: '23:59',
    type: 'prazo',
    description: 'Prazo final para apresentação da contestação',
    relatedCase: 'Processo nº 0987654-32.2024.8.26.0100'
  },
  {
    id: '3',
    title: 'Reunião com Cliente',
    date: new Date(2024, 3, 25),
    startTime: '10:00',
    endTime: '11:30',
    type: 'reuniao',
    description: 'Reunião para discutir estratégia do caso',
    relatedCase: 'Processo nº 0123456-78.2024.8.26.0100'
  }
];

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    type: 'reuniao',
    description: ''
  });
  
  const { toast } = useToast();
  const today = startOfToday();
  
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setNewEvent(prev => ({
      ...prev,
      date
    }));
    setIsDialogOpen(true);
  };

  const handleCreateEvent = () => {
    const generatedId = Date.now().toString();
    const newEventWithId = { ...newEvent, id: generatedId };
    
    setEvents([...events, newEventWithId]);
    setIsDialogOpen(false);
    
    toast({
      title: "Evento criado",
      description: `"${newEvent.title}" foi adicionado ao calendário.`
    });
    
    setNewEvent({
      title: '',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
      type: 'reuniao',
      description: ''
    });
  };

  const handleNavigate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'prev') {
      setCurrentMonth(add(currentMonth, { months: -1 }));
    } else if (direction === 'next') {
      setCurrentMonth(add(currentMonth, { months: 1 }));
    } else {
      setCurrentMonth(startOfMonth(new Date()));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h1 className="text-2xl font-bold text-evji-primary">Calendário</h1>
              <Button onClick={() => {
                setSelectedDate(new Date());
                setIsDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Evento
              </Button>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Calendário</CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarGrid
                  currentMonth={currentMonth}
                  days={days}
                  today={today}
                  events={events}
                  onDateClick={handleDateClick}
                  onNavigate={handleNavigate}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <UpcomingEvents events={events} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <EventForm 
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          onSubmit={handleCreateEvent}
        />
      </Dialog>
    </div>
  );
};

export default CalendarPage;

