
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/components/NotificationSystem';

export type AgentType = 
  | 'analista-requisitos' 
  | 'estrategista' 
  | 'revisor-legal' 
  | 'assistente-redacao' 
  | 'pesquisador';

interface SimulationResult {
  success: boolean;
  message: string;
  details?: any;
}

export function useAgentSimulation(caseId?: string) {
  const [isProcessing, setIsProcessing] = useState<{ [key in AgentType]?: boolean }>({});
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const simulateAgent = async (agentType: AgentType): Promise<SimulationResult> => {
    setIsProcessing(prev => ({ ...prev, [agentType]: true }));

    // Simular um atraso para o processamento
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    try {
      // Mock de resultados dos diferentes agentes
      let result: SimulationResult = { success: true, message: '' };

      switch (agentType) {
        case 'analista-requisitos':
          result = {
            success: true,
            message: 'Análise de requisitos concluída com sucesso',
            details: {
              documentosAnalisados: 3,
              requisitosIdentificados: 7,
              problemasPotenciais: 2
            }
          };
          addNotification('success', 'Análise Concluída', 'O analista de requisitos concluiu o processamento dos documentos.', 'case');
          break;

        case 'estrategista':
          result = {
            success: true,
            message: 'Estratégia jurídica desenvolvida com sucesso',
            details: {
              estrategiasRecomendadas: 2,
              jurisprudenciasEncontradas: 5,
              riscoIdentificado: 'Médio'
            }
          };
          addNotification('info', 'Estratégia Desenvolvida', 'O estrategista criou recomendações para o caso.', 'case');
          break;

        case 'revisor-legal':
          result = {
            success: true,
            message: 'Revisão legal concluída',
            details: {
              pontosVerificados: 12,
              correcoesRecomendadas: 3,
              nivelConformidade: 'Alto'
            }
          };
          addNotification('info', 'Revisão Concluída', 'O revisor legal finalizou a análise dos documentos.', 'document');
          break;

        case 'assistente-redacao':
          result = {
            success: true,
            message: 'Documento redigido com sucesso',
            details: {
              tipoDocumento: 'Petição Inicial',
              paginas: 8,
              anexos: 3
            }
          };
          addNotification('success', 'Documento Gerado', 'O assistente de redação criou um novo documento.', 'document');
          break;

        case 'pesquisador':
          result = {
            success: true,
            message: 'Pesquisa jurídica concluída',
            details: {
              fontesPesquisadas: 4,
              documentosEncontrados: 17,
              relevanciaMediaEncontrada: 'Alta'
            }
          };
          addNotification('info', 'Pesquisa Finalizada', 'O pesquisador encontrou 17 documentos relevantes.', 'document');
          break;

        default:
          result = {
            success: false,
            message: 'Agente não reconhecido'
          };
      }

      // Usar o novo formato de toast com sonner para uma experiência melhor
      toast({
        title: result.success ? "Processamento concluído" : "Erro no processamento",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });

      return result;
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao executar o agente";
      toast({
        title: "Erro no processamento",
        description: errorMessage,
        variant: "destructive",
      });
      
      addNotification('alert', 'Erro no Processamento', errorMessage, 'system');
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsProcessing(prev => ({ ...prev, [agentType]: false }));
    }
  };

  return {
    simulateAgent,
    isProcessing
  };
}
