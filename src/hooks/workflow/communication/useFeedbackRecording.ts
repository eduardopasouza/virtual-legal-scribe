
import { useMutation } from '@tanstack/react-query';
import { useAgentSimulation } from '@/hooks/agent/useAgentSimulation';
import { toast } from "sonner";
import { FeedbackItem } from '@/agents/comunicador/types';

export function useFeedbackRecording(caseId?: string) {
  const { simulateAgent } = useAgentSimulation(caseId);

  return useMutation({
    mutationFn: async (feedbackItem: Omit<FeedbackItem, 'timestamp' | 'resolved'>) => {
      if (!caseId) throw new Error("ID do caso não fornecido");
      
      const result = await simulateAgent('comunicador', {
        input: {
          ...feedbackItem,
          resolved: false
        },
        metadata: {
          action: 'record-feedback'
        }
      });
      
      if (!result.success) {
        throw new Error(result.message || "Falha ao registrar feedback");
      }
      
      return result.details?.feedback as FeedbackItem;
    },
    onSuccess: () => {
      toast.success("Feedback registrado", {
        description: "Suas observações foram salvas e serão processadas"
      });
    },
    onError: (error: Error) => {
      toast.error("Erro ao registrar feedback", {
        description: error.message
      });
    }
  });
}
