
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { workflowService } from '@/workflow';
import { AgentType } from '@/hooks/agent/types';
import { useAgentSimulation } from '@/hooks/agent/useAgentSimulation';
import { toast } from "sonner";
import { ClientCommunication, FeedbackItem } from '@/agents/comunicador/types';

export function useClientCommunication(caseId?: string) {
  const [communication, setCommunication] = useState<ClientCommunication | null>(null);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const { simulateAgent, isProcessing } = useAgentSimulation(caseId);

  // Generate communication for the client based on the final document
  const generateCommunication = useMutation({
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
    onSuccess: (data) => {
      setCommunication(data);
      toast.success("Comunicação para cliente gerada", {
        description: "Resumo e materiais de apresentação prontos"
      });
      
      // Log this action in the workflow
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

  // Record feedback from the client
  const recordFeedback = useMutation({
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
    onSuccess: (data) => {
      setFeedback(prev => [...prev, data]);
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

  // Check if any updates are needed based on feedback
  const checkForUpdates = useMutation({
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

  return {
    communication,
    feedback,
    isGenerating: isProcessing.comunicador || generateCommunication.isPending,
    isRecordingFeedback: recordFeedback.isPending,
    isCheckingForUpdates: checkForUpdates.isPending,
    generateCommunication,
    recordFeedback,
    checkForUpdates
  };
}

