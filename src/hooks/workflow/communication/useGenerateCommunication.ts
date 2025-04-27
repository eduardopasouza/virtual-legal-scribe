
import { useMutation } from '@tanstack/react-query';
import { workflowService } from '@/workflow';
import { useAgentSimulation } from '@/hooks/agent/useAgentSimulation';
import { toast } from "sonner";
import { ClientCommunication } from '@/agents/comunicador/types';
import { executeWithRecovery } from '@/utils/errorRecoveryUtils';

export function useGenerateCommunication(caseId?: string) {
  const { simulateAgent } = useAgentSimulation(caseId);

  return useMutation({
    mutationFn: async () => {
      if (!caseId) throw new Error("ID do caso não fornecido");

      const result = await executeWithRecovery(
        async () => {
          const response = await simulateAgent('comunicador', {
            metadata: { action: 'generate-communication' }
          });
          
          if (!response.success || !response.details?.communication) {
            throw new Error(response.message || "Falha ao gerar comunicação");
          }
          
          return response.details.communication as ClientCommunication;
        },
        ['retry', 'notify'],
        {
          maxRetries: 2,
          errorMessage: "Erro ao gerar comunicação para o cliente"
        }
      );

      return result;
    },
    onSuccess: () => {
      toast.success("Comunicação para cliente gerada", {
        description: "Resumo e materiais de apresentação prontos"
      });
      
      if (caseId) {
        workflowService.logProgress(caseId, "Comunicação para cliente gerada");
      }
    }
  });
}
