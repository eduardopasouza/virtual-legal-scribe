
import { useMutation } from '@tanstack/react-query';
import { workflowService } from '@/workflow';
import { useAgentSimulation } from '@/hooks/agent/useAgentSimulation';
import { toast } from "sonner";
import { ClientCommunication } from '@/agents/comunicador/types';

export function useGenerateCommunication(caseId?: string) {
  const { simulateAgent } = useAgentSimulation(caseId);

  return useMutation({
    mutationFn: async () => {
      if (!caseId) throw new Error("ID do caso não fornecido");

      const result = await simulateAgent('comunicador', {
        metadata: {
          action: 'generate-communication'
        }
      });
      
      if (!result.success || !result.details?.communication) {
        throw new Error(result.message || "Falha ao gerar comunicação");
      }
      
      return result.details.communication as ClientCommunication;
    },
    onSuccess: () => {
      toast.success("Comunicação para cliente gerada", {
        description: "Resumo e materiais de apresentação prontos"
      });
      
      if (caseId) {
        workflowService.logProgress(caseId, "Comunicação para cliente gerada");
      }
    },
    onError: (error: Error) => {
      toast.error("Erro ao gerar comunicação", {
        description: error.message
      });
    }
  });
}
