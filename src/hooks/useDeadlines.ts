
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Deadline } from '@/types/case';
import { useNotifications } from '@/components/notification/NotificationSystem';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export function useDeadlines(caseId?: string) {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();
  const { toast } = useToast();

  const { data: deadlines, isLoading } = useQuery({
    queryKey: ['deadlines', caseId],
    queryFn: async () => {
      if (!caseId) return [];
      
      const { data, error } = await supabase
        .from('deadlines')
        .select('*')
        .eq('case_id', caseId)
        .order('date', { ascending: true });

      if (error) throw error;
      return data as Deadline[];
    },
    enabled: !!caseId
  });

  const createDeadline = useMutation({
    mutationFn: async (newDeadline: Omit<Deadline, 'id' | 'created_at'>) => {
      // First create the deadline
      const { data: deadlineData, error: deadlineError } = await supabase
        .from('deadlines')
        .insert(newDeadline)
        .select()
        .single();

      if (deadlineError) throw deadlineError;
      
      // Then create a calendar event for this deadline
      const { data: caseData } = await supabase
        .from('cases')
        .select('title, number')
        .eq('id', newDeadline.case_id)
        .single();
      
      // Create event in calendar
      const eventData = {
        title: `Prazo: ${newDeadline.description}`,
        date: newDeadline.date,
        start_time: '00:00',
        end_time: '23:59',
        type: 'prazo',
        description: `Deadline para ${newDeadline.description}`,
        related_case: caseData?.number || newDeadline.case_id,
        notification_settings: {
          notifyBefore: 1,
          notified: false,
          priority: 'high'
        }
      };
      
      const { error: eventError } = await supabase
        .from('events')
        .insert(eventData);
      
      if (eventError) {
        console.error("Erro ao criar evento no calendário:", eventError);
        // Still return the deadline data since the main operation succeeded
      }

      addNotification(
        'warning',
        'Novo prazo adicionado',
        `Um novo prazo foi adicionado para ${format(new Date(newDeadline.date), 'dd/MM/yyyy')}`,
        'deadline'
      );

      return deadlineData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines', caseId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: "Prazo adicionado com sucesso",
        description: "O prazo foi adicionado e sincronizado com o calendário"
      });
    },
    onError: (error) => {
      console.error("Erro ao criar prazo:", error);
      toast({
        title: "Erro ao adicionar prazo",
        description: "Não foi possível adicionar o prazo",
        variant: "destructive"
      });
    }
  });

  return { deadlines, isLoading, createDeadline };
}
