
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowService } from '@/workflow';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/components/notification/NotificationSystem';
import { supabase } from '@/integrations/supabase/client';

export function useWorkflowInitialization(caseId?: string) {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();

  const initializeWorkflow = useMutation({
    mutationFn: async (userId?: string) => {
      if (!caseId) throw new Error("Case ID is required");
      return await workflowService.initializeWorkflow(caseId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow_stages', caseId] });
      queryClient.invalidateQueries({ queryKey: ['current_stage', caseId] });
      
      toast({
        title: 'Fluxo iniciado',
        description: 'O fluxo de trabalho foi iniciado com sucesso.'
      });
      
      addNotification(
        'success',
        'Fluxo de trabalho',
        'O fluxo de trabalho foi iniciado para este caso.',
        'case'
      );
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao iniciar fluxo',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  return { initializeWorkflow };
}

