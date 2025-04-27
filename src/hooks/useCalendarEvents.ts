
import { useState, useEffect, useCallback } from 'react';
import { addMonths, subMonths, format, startOfMonth, endOfMonth, eachDayOfInterval, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Event } from '@/types/calendar';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';

export function useCalendarEvents(initialEvents: Event[] = []) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isLoading, setIsLoading] = useState(true);
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
  const { user } = useAuth();

  const loadEvents = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*');
      
      if (error) throw error;
      
      // Convert date strings to Date objects
      const formattedEvents = data.map(event => ({
        id: event.id,
        date: new Date(event.date),
        title: event.title,
        startTime: event.start_time,
        endTime: event.end_time,
        type: event.type || 'reuniao',
        description: event.description,
        relatedCase: event.related_case,
        notificationSettings: {
          notifyBefore: 1,
          notified: false,
          priority: 'medium'
        },
        feedback: []
      })) as Event[];
      
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
  }, [user, toast]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

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
    setSelectedDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setNewEvent(prev => ({ ...prev, date }));
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !user) return;
    
    try {
      const eventToSave = {
        title: newEvent.title,
        date: format(newEvent.date, 'yyyy-MM-dd'),
        start_time: newEvent.startTime,
        end_time: newEvent.endTime,
        type: newEvent.type,
        description: newEvent.description,
        related_case: newEvent.relatedCase || null
      };
      
      const { data, error } = await supabase
        .from('events')
        .insert(eventToSave)
        .select()
        .single();
      
      if (error) throw error;
      
      const eventToAdd: Event = {
        ...newEvent,
        id: data.id,
        date: new Date(data.date),
        feedback: []
      };
      
      setEvents(prevEvents => [...prevEvents, eventToAdd]);
      setShowEventForm(false);
      
      toast({
        title: "Evento adicionado com sucesso",
        description: `${newEvent.title} em ${format(newEvent.date, 'dd/MM/yyyy', { locale: ptBR })}`
      });
    } catch (error) {
      console.error("Erro ao adicionar evento:", error);
      toast({
        title: "Erro ao adicionar evento",
        description: "Não foi possível salvar o evento",
        variant: "destructive"
      });
    }
  };

  const handleAddNote = async (date: Date, note: string) => {
    if (!note.trim() || !user) return;
    
    try {
      const existingEvent = events.find(e => 
        e.date.getDate() === date.getDate() && 
        e.date.getMonth() === date.getMonth() && 
        e.date.getFullYear() === date.getFullYear() && 
        e.type === 'outro'
      );
      
      if (existingEvent) {
        const updatedEvent = {
          activitySummary: note,
        };
        
        const { error } = await supabase
          .from('events')
          .update({
            activity_summary: updatedEvent.activitySummary
          })
          .eq('id', existingEvent.id);
        
        if (error) throw error;
        
        const updatedEvents = events.map(e => {
          if (e.id === existingEvent.id) {
            return {
              ...e,
              activitySummary: updatedEvent.activitySummary,
            };
          }
          return e;
        });
        
        setEvents(updatedEvents);
      } else {
        const eventToSave = {
          title: 'Anotação',
          date: format(date, 'yyyy-MM-dd'),
          start_time: '00:00',
          end_time: '00:00',
          type: 'outro',
          description: 'Anotação diária',
          activity_summary: note
        };
        
        const { data, error } = await supabase
          .from('events')
          .insert(eventToSave)
          .select()
          .single();
        
        if (error) throw error;
        
        const newEvent: Event = {
          id: data.id,
          title: 'Anotação',
          date: new Date(data.date),
          startTime: '00:00',
          endTime: '00:00',
          type: 'outro',
          description: 'Anotação diária',
          activitySummary: note,
        };
        
        setEvents(prev => [...prev, newEvent]);
      }
      
      toast({
        title: "Anotação adicionada",
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
  };

  const handleDismissNotification = async (eventId: string) => {
    try {
      setNotifiedEvents(prev => new Set([...prev, eventId]));
      
      const event = events.find(e => e.id === eventId);
      if (!event) return;
      
      // Update the event in the database
      const { error } = await supabase
        .from('events')
        .update({
          // We'll store this in a custom column in the future if needed
        })
        .eq('id', eventId);
      
      if (error) throw error;
      
      // Update the local state
      setEvents(prev => prev.map(e => 
        e.id === eventId 
          ? { ...e, notificationSettings: { ...e.notificationSettings, notified: true } }
          : e
      ));
      
      toast({
        description: `Notificação descartada: ${event.title}`,
      });
    } catch (error) {
      console.error("Erro ao descartar notificação:", error);
    }
  };

  useEffect(() => {
    setNewEvent(prev => ({ ...prev, date: selectedDate }));
  }, [selectedDate]);

  // Generate mock events for demonstration
  useEffect(() => {
    if (events.length === 0 && !isLoading) {
      const today = new Date();
      const mockEvents: Event[] = [
        {
          id: '1',
          title: 'Audiência Preliminar',
          date: today,
          startTime: '14:00',
          endTime: '15:30',
          type: 'audiencia',
          description: 'Audiência preliminar para definição do caso',
          relatedCase: 'PROC-12345',
        },
        {
          id: '2',
          title: 'Prazo para Contestação',
          date: addDays(today, 1),
          startTime: '18:00',
          endTime: '18:30',
          type: 'prazo',
          description: 'Último dia para entregar contestação',
          relatedCase: 'PROC-12349',
        },
        {
          id: '3',
          title: 'Reunião com Cliente',
          date: addDays(today, 3),
          startTime: '10:00',
          endTime: '11:00',
          type: 'reuniao',
          description: 'Reunião para discutir estratégia do caso',
          relatedCase: 'PROC-12356',
        },
      ];
      setEvents(mockEvents);
    }
  }, [events.length, isLoading]);

  return {
    currentMonth,
    selectedDate,
    showEventForm,
    events,
    newEvent,
    isLoading,
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
    loadEvents
  };
}
