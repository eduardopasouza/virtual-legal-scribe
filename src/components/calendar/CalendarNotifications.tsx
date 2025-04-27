
import React, { useEffect } from 'react';
import { useCalendarNotifications } from '@/hooks/useCalendarNotifications';
import { Event } from '@/types/calendar';

interface CalendarNotificationsProps {
  events: Event[];
}

export function CalendarNotifications({ events }: CalendarNotificationsProps) {
  const { notifiedEvents } = useCalendarNotifications(events);
  
  // This component doesn't render anything visible
  // It just processes events and generates notifications
  return null;
}
