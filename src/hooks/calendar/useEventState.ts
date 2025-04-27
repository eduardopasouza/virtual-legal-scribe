
import { useState, useCallback } from 'react';
import { addMonths, subMonths } from 'date-fns';
import type { Event } from '@/types/calendar';

export function useEventState(initialEvents: Event[] = []) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isLoading, setIsLoading] = useState(true);
  const [notifiedEvents, setNotifiedEvents] = useState<Set<string>>(new Set());
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    date: selectedDate,
    startTime: '09:00',
    endTime: '10:00',
    type: 'reuniao',
    description: '',
    notificationSettings: {
      notifyBefore: 1,
      notified: false,
      priority: 'medium'
    }
  });

  const handlePreviousMonth = useCallback(() => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  }, []);

  const handleTodayClick = useCallback(() => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  }, []);

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setNewEvent(prev => ({ ...prev, date }));
  }, []);

  return {
    currentMonth,
    selectedDate,
    showEventForm,
    events,
    newEvent,
    isLoading,
    notifiedEvents,
    setCurrentMonth,
    setSelectedDate,
    setShowEventForm,
    setEvents,
    setNewEvent,
    setIsLoading,
    setNotifiedEvents,
    handlePreviousMonth,
    handleNextMonth,
    handleTodayClick,
    handleDateClick
  };
}
