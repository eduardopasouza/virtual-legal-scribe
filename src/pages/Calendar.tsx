
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { UpcomingEvents } from '@/components/calendar/UpcomingEvents';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedbackForm } from '@/components/client-communication/FeedbackForm';
import { useFeedbackRecording } from '@/hooks/workflow/communication/useFeedbackRecording';
import { toast } from "sonner";
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Event } from '@/types/calendar';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Audiência de Conciliação',
      date: new Date(2025, 3, 15),
      startTime: '14:00',
      endTime: '15:30',
      type: 'audiencia',
      description: 'Audiência de conciliação no Fórum Central',
      relatedCase: 'Caso #12345',
      activitySummary: 'Atendimento bem sucedido ao cliente',
    },
    {
      id: '2',
      title: 'Prazo Contestação',
      date: new Date(2025, 3, 20),
      startTime: '18:00',
      endTime: '18:00',
      type: 'prazo',
      description: 'Prazo final para contestação',
      relatedCase: 'Caso #12349'
    },
    {
      id: '3',
      title: 'Reunião com Cliente',
      date: new Date(2025, 3, 25),
      startTime: '10:00',
      endTime: '11:00',
      type: 'reuniao',
      description: 'Discussão de estratégia',
      relatedCase: 'Caso #12356'
    }
  ]);
  
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    date: selectedDate,
    startTime: '09:00',
    endTime: '10:00',
    type: 'reuniao',
    description: ''
  });
  
  const [feedbackType, setFeedbackType] = useState<'question' | 'correction' | 'approval'>('question');
  const [feedbackContent, setFeedbackContent] = useState('');
  const { mutateAsync: recordFeedback, isPending: isRecordingFeedback } = useFeedbackRecording();
  
  // Get all days in current month
  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };
  
  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };
  
  const handleTodayClick = () => {
    setCurrentMonth(new Date());
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setNewEvent(prev => ({ ...prev, date }));
  };
  
  const handleAddEvent = () => {
    if (!newEvent.title) return;
    
    const eventToAdd = {
      ...newEvent,
      id: Math.random().toString(36).substring(2, 9)
    };
    
    setEvents(prevEvents => [...prevEvents, eventToAdd]);
    setShowEventForm(false);
    toast.success("Evento adicionado com sucesso", {
      description: `${newEvent.title} em ${format(newEvent.date, 'dd/MM/yyyy')}`
    });
  };
  
  const handleAddNote = (date: Date, note: string) => {
    // Find an existing event for this date that might have notes
    const existingEvent = events.find(e => 
      e.date.getDate() === date.getDate() && 
      e.date.getMonth() === date.getMonth() && 
      e.date.getFullYear() === date.getFullYear() && 
      e.type === 'outro'
    );
    
    if (existingEvent) {
      // Update existing event with new note
      const updatedEvents = events.map(e => {
        if (e.id === existingEvent.id) {
          return {
            ...e,
            notes: e.notes ? `${e.notes}\n${note}` : note,
            activitySummary: note,
          };
        }
        return e;
      });
      setEvents(updatedEvents);
    } else {
      // Create a new event for this note
      const newEvent: Event = {
        id: Math.random().toString(36).substring(2, 9),
        title: 'Anotação',
        date: date,
        startTime: '00:00',
        endTime: '00:00',
        type: 'outro',
        description: 'Anotação diária',
        notes: note,
        activitySummary: note,
      };
      setEvents(prev => [...prev, newEvent]);
    }
    
    toast.success("Anotação adicionada", {
      description: "Sua anotação foi salva e será analisada pelo sistema"
    });
  };
  
  const handleSubmitFeedback = async () => {
    if (!feedbackContent.trim()) return;
    
    try {
      await recordFeedback({
        type: feedbackType,
        content: feedbackContent,
        priority: 'medium' // Changed from 'normal' to 'medium'
      });
      
      setFeedbackContent('');
      toast.success("Feedback registrado", {
        description: "Seu feedback será analisado pela nossa equipe"
      });
    } catch (error) {
      console.error('Erro ao registrar feedback:', error);
      toast.error("Erro ao registrar feedback", {
        description: "Ocorreu um erro ao enviar seu feedback"
      });
    }
  };
  
  // Update newEvent.date when selectedDate changes
  useEffect(() => {
    setNewEvent(prev => ({ ...prev, date: selectedDate }));
  }, [selectedDate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-3xl font-bold text-evji-primary">Calendário</h2>
              <Button onClick={() => setShowEventForm(true)}>Adicionar Evento</Button>
            </div>
            
            <Tabs defaultValue="calendar">
              <TabsList className="mb-4">
                <TabsTrigger value="calendar">Calendário</TabsTrigger>
                <TabsTrigger value="upcoming">Eventos Próximos</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendário de Eventos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                      <div className="md:col-span-3">
                        <CalendarGrid 
                          currentMonth={currentMonth}
                          days={getDaysInMonth()}
                          today={new Date()}
                          events={events}
                          onDateClick={handleDateClick}
                          onNavigate={(direction) => {
                            if (direction === 'prev') handlePreviousMonth();
                            else if (direction === 'next') handleNextMonth();
                            else handleTodayClick();
                          }}
                          onAddNote={handleAddNote}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <h3 className="font-medium mb-3">Eventos Próximos</h3>
                        <UpcomingEvents events={events} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="upcoming">
                <Card>
                  <CardHeader>
                    <CardTitle>Eventos Próximos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UpcomingEvents events={events} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="feedback">
                <Card>
                  <CardHeader>
                    <CardTitle>Enviar Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FeedbackForm
                      feedbackType={feedbackType}
                      feedbackContent={feedbackContent}
                      isRecordingFeedback={isRecordingFeedback}
                      onTypeChange={setFeedbackType}
                      onContentChange={setFeedbackContent}
                      onSubmit={handleSubmitFeedback}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {showEventForm && (
              <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Novo Evento</DialogTitle>
                    <DialogDescription>
                      Adicione um novo evento ao calendário
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input 
                        id="title" 
                        value={newEvent.title} 
                        onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                        placeholder="Título do evento"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Data</Label>
                        <div className="flex items-center h-10 rounded-md border border-input px-3 py-2">
                          {newEvent.date.toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="type">Tipo</Label>
                        <Select 
                          value={newEvent.type}
                          onValueChange={value => setNewEvent({...newEvent, type: value as Event['type']})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="audiencia">Audiência</SelectItem>
                            <SelectItem value="prazo">Prazo</SelectItem>
                            <SelectItem value="reuniao">Reunião</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Hora de Início</Label>
                        <Input 
                          id="startTime" 
                          type="time" 
                          value={newEvent.startTime}
                          onChange={e => setNewEvent({...newEvent, startTime: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="endTime">Hora de Término</Label>
                        <Input 
                          id="endTime" 
                          type="time" 
                          value={newEvent.endTime}
                          onChange={e => setNewEvent({...newEvent, endTime: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="relatedCase">Processo Relacionado (opcional)</Label>
                      <Input 
                        id="relatedCase" 
                        value={newEvent.relatedCase || ''}
                        onChange={e => setNewEvent({...newEvent, relatedCase: e.target.value})}
                        placeholder="Número do processo ou nome do caso"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea 
                        id="description" 
                        value={newEvent.description}
                        onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                        placeholder="Detalhes adicionais sobre o evento"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleAddEvent} disabled={!newEvent.title}>Salvar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calendar;
