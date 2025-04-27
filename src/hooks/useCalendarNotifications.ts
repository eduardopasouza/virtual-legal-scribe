
import { useState, useEffect } from 'react';
import { useNotifications } from '@/components/notification/NotificationSystem';
import { Event } from '@/types/calendar';
import { differenceInDays, isPast, isFuture, isToday } from 'date-fns';

export function useCalendarNotifications(events: Event[]) {
  const [notifiedEvents, setNotifiedEvents] = useState<Set<string>>(new Set());
  const { addNotification } = useNotifications();

  // Check for events that need notifications
  useEffect(() => {
    // Only process events that haven't been notified yet
    const eventsToProcess = events.filter(event => !notifiedEvents.has(event.id));
    
    if (eventsToProcess.length === 0) return;
    
    const todayEvents = eventsToProcess.filter(event => isToday(event.date));
    const upcomingEvents = eventsToProcess.filter(event => {
      const daysUntil = differenceInDays(event.date, new Date());
      return isFuture(event.date) && daysUntil <= 3; // Events within next 3 days
    });
    const pastDueEvents = eventsToProcess.filter(event => 
      isPast(event.date) && !isToday(event.date)
    );
    
    // Create notifications for events happening today
    todayEvents.forEach(event => {
      addNotification(
        'info',
        'Evento Hoje',
        `${event.title} está agendado para hoje às ${event.startTime}`,
        'deadline'
      );
      setNotifiedEvents(prev => new Set([...prev, event.id]));
    });
    
    // Create notifications for upcoming events
    upcomingEvents.forEach(event => {
      const daysUntil = differenceInDays(event.date, new Date());
      addNotification(
        'info',
        'Evento Próximo',
        `${event.title} ocorrerá em ${daysUntil} dia${daysUntil > 1 ? 's' : ''} (${event.date.toLocaleDateString()})`,
        'deadline'
      );
      setNotifiedEvents(prev => new Set([...prev, event.id]));
    });
    
    // Create notifications for past due events
    pastDueEvents.forEach(event => {
      if (event.type === 'prazo') {
        addNotification(
          'alert',
          'Prazo Vencido',
          `O prazo para "${event.title}" venceu em ${event.date.toLocaleDateString()}`,
          'deadline'
        );
      }
      setNotifiedEvents(prev => new Set([...prev, event.id]));
    });
  }, [events, addNotification]);
  
  return {
    notifiedEvents,
  };
}
