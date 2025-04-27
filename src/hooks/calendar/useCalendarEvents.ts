
import { useEffect } from 'react';
import { useEventState } from './useEventState';
import { useEventOperations } from './useEventOperations';
import type { Event } from '@/types/calendar';

export function useCalendarEvents(initialEvents: Event[] = []) {
  const state = useEventState(initialEvents);
  const operations = useEventOperations();

  useEffect(() => {
    operations.loadEvents(state.setEvents, state.setIsLoading);
  }, [operations.loadEvents]);

  const handleAddEvent = async () => {
    await operations.handleAddEvent(
      state.newEvent,
      state.setEvents,
      state.setShowEventForm
    );
  };

  const handleAddNote = async (date: Date, note: string) => {
    await operations.handleAddNote(
      date,
      note,
      state.events,
      state.setEvents
    );
  };

  return {
    ...state,
    handleAddEvent,
    handleAddNote,
  };
}
