import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { UpcomingEvents } from '@/components/calendar/UpcomingEvents';
import { FeedbackForm } from '@/components/client-communication/FeedbackForm';
import { useFeedbackRecording } from '@/hooks/workflow/communication/useFeedbackRecording';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { EventFormDialog } from '@/components/calendar/EventFormDialog';
import { toast } from "sonner";

const Calendar = () => {
  const { 
    currentMonth,
    selectedDate,
    showEventForm,
    events,
    newEvent,
    getDaysInMonth,
    handlePreviousMonth,
    handleNextMonth,
    handleTodayClick,
    handleDateClick,
    handleAddEvent,
    handleAddNote,
    setShowEventForm,
    setNewEvent,
  } = useCalendarEvents([
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

  const [feedbackType, setFeedbackType] = useState<'question' | 'correction' | 'approval'>('question');
  const [feedbackContent, setFeedbackContent] = useState('');
  const { mutateAsync: recordFeedback, isPending: isRecordingFeedback } = useFeedbackRecording();

  const handleSubmitFeedback = async () => {
    if (!feedbackContent.trim()) return;
    
    try {
      await recordFeedback({
        type: feedbackType,
        content: feedbackContent,
        priority: 'medium'
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
            
            <EventFormDialog
              showEventForm={showEventForm}
              setShowEventForm={setShowEventForm}
              newEvent={newEvent}
              setNewEvent={setNewEvent}
              onSubmit={handleAddEvent}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Calendar;
