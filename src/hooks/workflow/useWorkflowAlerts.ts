
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workflowService, WorkflowAlert } from '@/workflow';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/components/notification/NotificationSystem';

export function useWorkflowAlerts(caseId?: string) {
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();

  const createWorkflowAlert = useMutation({
    mutationFn: async (alert: WorkflowAlert) => {
      if (!caseId) throw new Error("Case ID is required");
      return await workflowService.createAlert(caseId, alert);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['alerts', caseId] });
      
      toast({
        title: 'Alerta criado',
        description: `Um novo alerta foi registrado: ${data.title}`,
        variant: 'destructive'
      });
      
      addNotification(
        'warning',
        'Alerta de fluxo',
        `${data.title}: ${data.description || 'Intercorrência detectada no fluxo'}`,
        'case'
      );
    }
  });

  return { createWorkflowAlert };
}

