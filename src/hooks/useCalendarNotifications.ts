
import { useState, useEffect } from 'react';
import { useNotifications } from '@/components/notification/NotificationSystem';
import { Event } from '@/types/calendar';
import { differenceInDays, isPast, isFuture, isToday, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function useCalendarNotifications(events: Event[]) {
  const [notifiedEvents, setNotifiedEvents] = useState<Set<string>>(new Set());
  const { addNotification } = useNotifications();

  // Check for events that need notifications
  useEffect(() => {
    // Only process events that haven't been notified yet or have notification settings
    const eventsToProcess = events.filter(event => (
      !notifiedEvents.has(event.id) && 
      (!event.notificationSettings?.notified || event.notificationSettings === undefined))
    );
    
    if (eventsToProcess.length === 0) return;
    
    const todayEvents = eventsToProcess.filter(event => isToday(new Date(event.date)));
    const upcomingEvents = eventsToProcess.filter(event => {
      if (!event.date) return false;
      const daysUntil = differenceInDays(new Date(event.date), new Date());
      // Events within next 3 days that aren't today
      return isFuture(new Date(event.date)) && daysUntil <= 3 && daysUntil > 0;
    });
    
    const pastDueEvents = eventsToProcess.filter(event => 
      isPast(new Date(event.date)) && !isToday(new Date(event.date))
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
      if (!event.date) return;
      const daysUntil = differenceInDays(new Date(event.date), new Date());
      
      const eventDate = format(new Date(event.date), 'dd/MM', { locale: ptBR });
      addNotification(
        'info',
        'Evento Próximo',
        `${event.title} ocorrerá em ${daysUntil} dia${daysUntil > 1 ? 's' : ''} (${eventDate})`,
        'deadline'
      );
      setNotifiedEvents(prev => new Set([...prev, event.id]));
    });
    
    // Create notifications for past due events
    pastDueEvents.forEach(event => {
      if (event.type === 'prazo') {
        const eventDate = format(new Date(event.date), 'dd/MM', { locale: ptBR });
        addNotification(
          'alert',
          'Prazo Vencido',
          `O prazo para "${event.title}" venceu em ${eventDate}`,
          'deadline'
        );
        setNotifiedEvents(prev => new Set([...prev, event.id]));
      }
    });
  }, [events, addNotification]);
  
  return {
    notifiedEvents,
  };
}
