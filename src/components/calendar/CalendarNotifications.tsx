
import React, { useEffect } from 'react';
import { useCalendarNotifications } from '@/hooks/useCalendarNotifications';
import { Event } from '@/types/calendar';
import { useNotifications } from '@/components/notification/NotificationSystem';
import { isPast, isToday, addDays, format, differenceInHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CalendarNotificationsProps {
  events: Event[];
}

export function CalendarNotifications({ events }: CalendarNotificationsProps) {
  const { notifiedEvents } = useCalendarNotifications(events);
  const { addNotification } = useNotifications();
  
  // Check for urgent events (less than 2 hours away)
  useEffect(() => {
    const now = new Date();
    const urgentEvents = events.filter(event => {
      if (!isToday(new Date(event.date))) return false;
      
      const [hours, minutes] = event.startTime.split(':').map(Number);
      const eventTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hours,
        minutes
      );
      
      const hoursDiff = differenceInHours(eventTime, now);
      return hoursDiff > 0 && hoursDiff <= 2;
    });
    
    urgentEvents.forEach(event => {
      if (!notifiedEvents.has(`urgent-${event.id}`)) {
        addNotification(
          'warning',
          'Evento em Breve',
          `"${event.title}" começará em menos de 2 horas (${event.startTime})`,
          'deadline'
        );
      }
    });
  }, [events, notifiedEvents, addNotification]);
  
  // This component doesn't render anything visible
  // It just processes events and generates notifications
  return null;
}
