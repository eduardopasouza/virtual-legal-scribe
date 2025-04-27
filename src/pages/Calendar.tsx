
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
import { FeedbackForm } from '@/components/client-communication/FeedbackForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Event } from '@/types/calendar';
import { useFeedbackRecording } from '@/hooks/workflow/communication/useFeedbackRecording';

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
    relatedCase: 'Processo nº 0123456-78.2024.8.26.0100',
    activitySummary: 'Debate sobre possível acordo'
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
    relatedCase: 'Processo nº 0123456-78.2024.8.26.0100',
    notes: 'Cliente preocupado com prazos',
    activitySummary: 'Definição de estratégias'
  }
];

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogFeedback, setIsDialogFeedback] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [feedbackType, setFeedbackType] = useState<'question' | 'correction' | 'approval'>('question');
  const [feedbackContent, setFeedbackContent] = useState('');
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
  const { mutateAsync: recordFeedback, isPending: isRecordingFeedback } = useFeedbackRecording();
  
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
  
  const handleAddNote = (date: Date, note: string) => {
    setEvents(prevEvents => {
      // Check if there's already an event on this day
      const existingEvent = prevEvents.find(event => 
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear() &&
        event.type === 'outro'
      );
      
      if (existingEvent) {
        // Add note to existing event
        return prevEvents.map(event => 
          event.id === existingEvent.id
            ? { ...event, notes: (event.notes ? `${event.notes}\n\n${note}` : note) }
            : event
        );
      } else {
        // Create new event with note
        return [...prevEvents, {
          id: Date.now().toString(),
          title: 'Anotação',
          date,
          startTime: '00:00',
          endTime: '00:00',
          type: 'outro',
          description: 'Anotação registrada pelo usuário',
          notes: note
        }];
      }
    });
  };
  
  const handleSubmitFeedback = async () => {
    if (!feedbackContent.trim()) return;
    
    try {
      await recordFeedback({
        type: feedbackType,
        content: feedbackContent
      });
      
      setFeedbackContent('');
      setIsDialogFeedback(false);
      
      toast({
        title: "Feedback registrado",
        description: "Seu feedback foi enviado para análise pelo sistema."
      });
    } catch (error) {
      console.error('Error recording feedback:', error);
      toast({
        variant: "destructive",
        title: "Erro ao registrar feedback",
        description: "Ocorreu um erro ao enviar seu feedback."
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-4 overflow-auto">
          <div className="space-y-4 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h1 className="text-2xl font-bold text-evji-primary">Calendário</h1>
              <div className="space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => setIsDialogFeedback(true)}
                >
                  Enviar Feedback
                </Button>
                <Button onClick={() => {
                  setSelectedDate(new Date());
                  setIsDialogOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Evento
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="col-span-1 lg:col-span-2 space-y-4">
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
                      onAddNote={handleAddNote}
                    />
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Próximos Eventos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UpcomingEvents events={events} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Resumo de Atividades</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="today">
                      <TabsList className="w-full">
                        <TabsTrigger value="today" className="flex-1">Hoje</TabsTrigger>
                        <TabsTrigger value="week" className="flex-1">Semana</TabsTrigger>
                        <TabsTrigger value="month" className="flex-1">Mês</TabsTrigger>
                      </TabsList>
                      <TabsContent value="today" className="space-y-4 pt-2">
                        {events
                          .filter(event => 
                            event.date.getDate() === today.getDate() &&
                            event.date.getMonth() === today.getMonth() &&
                            event.date.getFullYear() === today.getFullYear()
                          )
                          .map(event => (
                            <div key={event.id} className="text-sm">
                              <div className="font-medium">{event.title}</div>
                              {event.activitySummary && (
                                <p className="text-muted-foreground mt-1">
                                  {event.activitySummary}
                                </p>
                              )}
                            </div>
                          ))}
                      </TabsContent>
                      <TabsContent value="week">
                        <p className="text-sm text-muted-foreground">
                          Resumo das atividades da semana atual.
                        </p>
                      </TabsContent>
                      <TabsContent value="month">
                        <p className="text-sm text-muted-foreground">
                          Resumo das atividades do mês atual.
                        </p>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>
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
      
      <Dialog open={isDialogFeedback} onOpenChange={setIsDialogFeedback}>
        <FeedbackForm
          feedbackType={feedbackType}
          feedbackContent={feedbackContent}
          isRecordingFeedback={isRecordingFeedback}
          onTypeChange={setFeedbackType}
          onContentChange={setFeedbackContent}
          onSubmit={handleSubmitFeedback}
        />
      </Dialog>
    </div>
  );
};

export default CalendarPage;
