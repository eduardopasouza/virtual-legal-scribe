
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { transformEventFromDB, transformEventToDB } from '@/utils/calendar/eventTransformers';
import type { Event } from '@/types/calendar';

export function useEventOperations() {
  const { toast } = useToast();

  const loadEvents = useCallback(async (setEvents: (events: Event[]) => void, setIsLoading: (loading: boolean) => void) => {
    try {
      const { data, error } = await supabase.from('events').select('*');
      
      if (error) throw error;
      
      const formattedEvents = data.map(transformEventFromDB);
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      toast({
        title: "Erro ao carregar eventos",
        description: "Não foi possível carregar os eventos do calendário",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleAddEvent = useCallback(async (
    newEvent: Omit<Event, 'id'>,
    setEvents: (events: Event[]) => void,
    setShowEventForm: (show: boolean) => void
  ) => {
    if (!newEvent.title) return;
    
    try {
      const eventToSave = transformEventToDB(newEvent);
      
      const { data, error } = await supabase
        .from('events')
        .insert(eventToSave)
        .select()
        .single();
      
      if (error) throw error;
      
      const eventToAdd: Event = transformEventFromDB(data);
      
      setEvents(prevEvents => [...prevEvents, eventToAdd]);
      setShowEventForm(false);
      
      toast({
        title: "Evento adicionado com sucesso",
        description: `${newEvent.title} foi adicionado ao calendário`
      });
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
      toast({
        title: "Erro ao adicionar evento",
        description: "Não foi possível salvar o evento",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleAddNote = useCallback(async (
    date: Date, 
    note: string,
    events: Event[],
    setEvents: (events: Event[]) => void
  ) => {
    if (!note.trim()) return;
    
    try {
      const existingEvent = events.find(e => 
        e.date.getDate() === date.getDate() && 
        e.date.getMonth() === date.getMonth() && 
        e.date.getFullYear() === date.getFullYear() && 
        e.type === 'outro'
      );
      
      if (existingEvent) {
        const { error } = await supabase
          .from('events')
          .update({
            description: note
          })
          .eq('id', existingEvent.id);
        
        if (error) throw error;
        
        setEvents(prevEvents => prevEvents.map(e => {
          if (e.id === existingEvent.id) {
            return {
              ...e,
              description: note,
              activitySummary: note,
            };
          }
          return e;
        }));
      } else {
        const eventToSave = {
          title: 'Anotação',
          date: date,
          start_time: '00:00',
          end_time: '00:00',
          type: 'outro',
          description: note
        };
        
        const { data, error } = await supabase
          .from('events')
          .insert(eventToSave)
          .select()
          .single();
        
        if (error) throw error;
        
        const newEvent = transformEventFromDB(data);
        setEvents(prevEvents => [...prevEvents, newEvent]);
      }
      
      toast({
        title: "Nota adicionada",
        description: "Sua anotação foi salva e será analisada pelo sistema"
      });
    } catch (error) {
      console.error("Erro ao adicionar anotação:", error);
      toast({
        title: "Erro ao adicionar anotação",
        description: "Não foi possível salvar a anotação",
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    loadEvents,
    handleAddEvent,
    handleAddNote
  };
}
