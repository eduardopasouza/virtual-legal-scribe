import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { EventFormDialog } from '@/components/calendar/EventFormDialog';
import { CalendarNotificationPanel } from '@/components/calendar/CalendarNotificationPanel';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { CalendarEventsList } from '@/components/calendar/CalendarEventsList';
import { CalendarNotifications } from '@/components/calendar/CalendarNotifications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

export default function Calendar() {
  const {
    currentMonth,
    selectedDate,
    showEventForm,
    events,
    newEvent,
    isLoading,
    handlePreviousMonth,
    handleNextMonth,
    handleTodayClick,
    handleDateClick,
    handleAddEvent,
    handleAddNote,
    setShowEventForm,
    setNewEvent,
    handleDismissNotification,
  } = useCalendarEvents();

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <CalendarNotificationPanel 
          events={events} 
          onDismiss={handleDismissNotification} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card className="rounded-lg">
              <Tabs defaultValue="month" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="month">Mês</TabsTrigger>
                  <TabsTrigger value="agenda">Agenda</TabsTrigger>
                </TabsList>
                
                <TabsContent value="month">
                  <CalendarGrid
                    currentMonth={currentMonth}
                    selectedDate={selectedDate}
                    events={events}
                    onPreviousMonth={handlePreviousMonth}
                    onNextMonth={handleNextMonth}
                    onTodayClick={handleTodayClick}
                    onDateClick={handleDateClick}
                    onAddNote={handleAddNote}
                    isLoading={isLoading}
                  />
                </TabsContent>
                
                <TabsContent value="agenda">
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Agenda de Eventos</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Hoje</h3>
                        <UpcomingEventsForDate date={new Date()} events={events} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Amanhã</h3>
                        <UpcomingEventsForDate date={new Date(Date.now() + 86400000)} events={events} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Esta Semana</h3>
                        <UpcomingEventsForWeek events={events} />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
          
          <div>
            <CalendarEventsList 
              events={events} 
              onAddEvent={() => setShowEventForm(true)} 
            />
          </div>
        </div>

        <EventFormDialog
          open={showEventForm}
          onOpenChange={setShowEventForm}
          event={newEvent}
          onEventChange={setNewEvent}
          onSubmit={handleAddEvent}
        />
        
        <CalendarNotifications events={events} />
      </div>
    </DashboardLayout>
  );
}

function UpcomingEventsForDate({ date, events }) {
  const eventsForDate = events.filter(event => 
    new Date(event.date).setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0)
  );
  
  if (eventsForDate.length === 0) {
    return <p className="text-sm text-muted-foreground">Sem eventos</p>;
  }
  
  return (
    <div className="space-y-2">
      {eventsForDate.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

function UpcomingEventsForWeek({ events }) {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  const weekEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate > today && eventDate <= nextWeek;
  });
  
  if (weekEvents.length === 0) {
    return <p className="text-sm text-muted-foreground">Sem eventos</p>;
  }
  
  return (
    <div className="space-y-2">
      {weekEvents.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

function EventCard({ event }) {
  const { getTypeColor, getTypeLabel } = useEventTypeStyles();
  
  return (
    <div className="flex items-center gap-2 p-2 border rounded-md">
      <div className={`w-1 self-stretch rounded-full ${getTypeColor(event.type)}`} />
      <div>
        <p className="font-medium">{event.title}</p>
        <p className="text-xs">{event.startTime} - {event.endTime}</p>
      </div>
    </div>
  );
}

function useEventTypeStyles() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'audiencia':
        return 'bg-blue-500';
      case 'prazo':
        return 'bg-red-500';
      case 'reuniao':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'audiencia':
        return 'Audiência';
      case 'prazo':
        return 'Prazo';
      case 'reuniao':
        return 'Reunião';
      default:
        return 'Outro';
    }
  };
  
  return { getTypeColor, getTypeLabel };
}
