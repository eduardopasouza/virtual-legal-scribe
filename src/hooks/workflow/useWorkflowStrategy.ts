
import { useMutation, useQuery } from '@tanstack/react-query';
import { workflowService } from '@/workflow';
import { useToast } from '@/hooks/use-toast';
import { AgentType } from '@/types/agent';
import { useAgentSimulation } from '@/hooks/agent/useAgentSimulation';

export function useWorkflowStrategy(caseId?: string) {
  const { toast } = useToast();
  const { simulateAgent, isProcessing } = useAgentSimulation(caseId);
  
  const executeInitialStrategy = useMutation({
    mutationFn: async () => {
      if (!caseId) throw new Error('ID do caso não fornecido');
      
      const result = await simulateAgent('estrategista');
      
      if (!result.success) {
        throw new Error(`Falha na estratégia inicial: ${result.message}`);
      }
      
      // Registrar os resultados estratégicos no fluxo de trabalho
      await workflowService.logProgress(caseId, 'Estratégia inicial definida', result.details);
      
      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Estratégia inicial definida',
        description: 'O estrategista jurídico definiu os objetivos e abordagem inicial do caso.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro na estratégia inicial',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const executeIntermediateStrategy = useMutation({
    mutationFn: async (data: any) => {
      if (!caseId) throw new Error('ID do caso não fornecido');
      
      const result = await simulateAgent('estrategista');
      
      if (!result.success) {
        throw new Error(`Falha na revisão estratégica: ${result.message}`);
      }
      
      // Registrar os ajustes estratégicos no fluxo de trabalho
      await workflowService.logProgress(caseId, 'Estratégia refinada com base em análises', result.details);
      
      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Estratégia refinada',
        description: 'O estrategista jurídico ajustou a estratégia com base nas análises e pesquisas.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro na revisão estratégica',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  const executeFinalStrategy = useMutation({
    mutationFn: async (documentDraft: string) => {
      if (!caseId) throw new Error('ID do caso não fornecido');
      
      const result = await simulateAgent('estrategista');
      
      if (!result.success) {
        throw new Error(`Falha na validação estratégica: ${result.message}`);
      }
      
      // Registrar a validação estratégica no fluxo de trabalho
      await workflowService.logProgress(caseId, 'Validação estratégica final concluída', result.details);
      
      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Validação estratégica concluída',
        description: 'O estrategista jurídico validou o alinhamento estratégico do documento final.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro na validação estratégica',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
  
  return {
    executeInitialStrategy,
    executeIntermediateStrategy,
    executeFinalStrategy,
    isProcessingStrategy: isProcessing['estrategista'] || false
  };
}
