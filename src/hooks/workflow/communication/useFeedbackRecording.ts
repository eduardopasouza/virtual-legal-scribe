
import { useMutation } from '@tanstack/react-query';
import { useAgentSimulation } from '@/hooks/agent/useAgentSimulation';
import { toast } from "sonner";
import { FeedbackItem } from '@/agents/comunicador/types';
import { executeWithRecovery } from '@/utils/errorRecoveryUtils';

export function useFeedbackRecording(caseId?: string) {
  const { simulateAgent } = useAgentSimulation(caseId);

  return useMutation({
    mutationFn: async (feedbackItem: Omit<FeedbackItem, 'timestamp' | 'resolved'>) => {
      if (!caseId) throw new Error("ID do caso não fornecido");
      
      const result = await executeWithRecovery(
        async () => {
          const response = await simulateAgent('comunicador', {
            input: {
              ...feedbackItem,
              resolved: false
            },
            metadata: { action: 'record-feedback' }
          });
          
          if (!response.success) {
            throw new Error(response.message || "Falha ao registrar feedback");
          }
          
          return response.details?.feedback as FeedbackItem;
        },
        ['retry', 'notify'],
        {
          maxRetries: 2,
          errorMessage: "Erro ao registrar feedback do cliente"
        }
      );

      return result;
    },
    onSuccess: () => {
      toast.success("Feedback registrado", {
        description: "Suas observações foram salvas e serão processadas"
      });
    }
  });
}
