
import { useMutation } from '@tanstack/react-query';
import { useAgentSimulation } from '@/hooks/agent/useAgentSimulation';
import { toast } from "sonner";
import { executeWithRecovery } from '@/utils/errorRecoveryUtils';

export function useUpdateCheck(caseId?: string) {
  const { simulateAgent } = useAgentSimulation(caseId);

  return useMutation({
    mutationFn: async () => {
      if (!caseId) throw new Error("ID do caso não fornecido");
      
      const result = await executeWithRecovery(
        async () => {
          const response = await simulateAgent('comunicador', {
            metadata: { action: 'check-for-updates' }
          });
          
          if (!response.success) {
            throw new Error(response.message || "Falha ao verificar atualizações");
          }
          
          return response.details?.updatesNeeded as boolean;
        },
        ['retry', 'notify'],
        {
          maxRetries: 2,
          errorMessage: "Erro ao verificar atualizações do documento"
        }
      );

      return result;
    },
    onSuccess: (updatesNeeded) => {
      if (updatesNeeded) {
        toast.warning("Correções necessárias", {
          description: "Existem ajustes pendentes baseados no feedback do cliente"
        });
      } else {
        toast.info("Sem correções pendentes", {
          description: "Documento está aprovado pelo cliente"
        });
      }
    }
  });
}
