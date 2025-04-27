
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { EventFormDialog } from '@/components/calendar/EventFormDialog';
import { CalendarNotificationPanel } from '@/components/calendar/CalendarNotificationPanel';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';

export default function Calendar() {
  const {
    currentMonth,
    selectedDate,
    showEventForm,
    events,
    newEvent,
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
        
        <div className="rounded-lg border bg-card">
          <CalendarGrid
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            events={events}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            onTodayClick={handleTodayClick}
            onDateClick={handleDateClick}
            onAddNote={handleAddNote}
          />
        </div>

        <EventFormDialog
          isOpen={showEventForm}
          onClose={() => setShowEventForm(false)}
          event={newEvent}
          onEventChange={setNewEvent}
          onSubmit={handleAddEvent}
        />
      </div>
    </DashboardLayout>
  );
}
