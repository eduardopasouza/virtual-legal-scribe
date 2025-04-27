
import { Event } from '@/types/calendar';
import { addDays, format } from 'date-fns';

export const transformEventFromDB = (data: any): Event => ({
  id: data.id,
  date: new Date(data.date),
  title: data.title,
  startTime: data.start_time,
  endTime: data.end_time,
  type: data.type || 'reuniao',
  description: data.description,
  relatedCase: data.related_case,
  notificationSettings: {
    notifyBefore: 1,
    notified: false,
    priority: 'medium'
  },
  feedback: []
});

export const transformEventToDB = (event: Omit<Event, 'id'>) => ({
  title: event.title,
  date: format(event.date, 'yyyy-MM-dd'),
  start_time: event.startTime,
  end_time: event.endTime,
  type: event.type,
  description: event.description,
  related_case: event.relatedCase || null
});
