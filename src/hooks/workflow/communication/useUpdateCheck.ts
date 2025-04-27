
import { useMutation } from '@tanstack/react-query';
import { useAgentSimulation } from '@/hooks/agent/useAgentSimulation';
import { toast } from "sonner";

export function useUpdateCheck(caseId?: string) {
  const { simulateAgent } = useAgentSimulation(caseId);

  return useMutation({
    mutationFn: async () => {
      if (!caseId) throw new Error("ID do caso não fornecido");
      
      const result = await simulateAgent('comunicador', {
        metadata: {
          action: 'check-for-updates'
        }
      });
      
      if (!result.success) {
        throw new Error(result.message || "Falha ao verificar atualizações");
      }
      
      return result.details?.updatesNeeded as boolean;
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
