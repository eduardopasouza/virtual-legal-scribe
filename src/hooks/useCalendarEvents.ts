
import { useState, useEffect } from 'react';
import { addMonths, subMonths, format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import type { Event } from '@/types/calendar';
import { useToast } from "@/hooks/use-toast";

export function useCalendarEvents(initialEvents: Event[] = []) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState<Event[]>(initialEvents);
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
  const [notifiedEvents, setNotifiedEvents] = useState<Set<string>>(new Set());
  const { toast } = useToast();

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
    toast({
      title: "Evento adicionado com sucesso",
      description: `${newEvent.title} em ${format(newEvent.date, 'dd/MM/yyyy')}`
    });
  };

  const handleAddNote = (date: Date, note: string) => {
    const existingEvent = events.find(e => 
      e.date.getDate() === date.getDate() && 
      e.date.getMonth() === date.getMonth() && 
      e.date.getFullYear() === date.getFullYear() && 
      e.type === 'outro'
    );
    
    if (existingEvent) {
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
    
    toast({
      title: "Anotação adicionada",
      description: "Sua anotação foi salva e será analisada pelo sistema"
    });
  };

  const handleDismissNotification = (eventId: string) => {
    setNotifiedEvents(prev => new Set([...prev, eventId]));
    const event = events.find(e => e.id === eventId);
    if (event) {
      setEvents(prev => prev.map(e => 
        e.id === eventId 
          ? { ...e, notificationSettings: { ...e.notificationSettings, notified: true } }
          : e
      ));
      toast({
        description: `Notificação descartada: ${event.title}`,
      });
    }
  };

  useEffect(() => {
    setNewEvent(prev => ({ ...prev, date: selectedDate }));
  }, [selectedDate]);

  return {
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
    notifiedEvents,
    handleDismissNotification,
  };
}
