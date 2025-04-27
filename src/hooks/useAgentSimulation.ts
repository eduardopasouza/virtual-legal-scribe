
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/components/notification/NotificationSystem';

export type AgentType = 
  | 'coordenador'
  | 'analista-requisitos' 
  | 'estrategista'
  | 'analista-fatos'
  | 'pesquisador'
  | 'analista-argumentacao'
  | 'redator'
  | 'assistente-redacao'
  | 'especialista'
  | 'revisor-legal'
  | 'revisor-texto'
  | 'comunicador';

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
        case 'coordenador':
          result = {
            success: true,
            message: 'Análise de status do caso concluída',
            details: {
              etapaAtual: 'Análise de Requisitos',
              proximaEtapa: 'Planejamento Estratégico',
              alertas: 2,
              prazoProximo: '5 dias'
            }
          };
          addNotification('info', 'Status Atualizado', 'O coordenador atualizou o status do caso.', 'case');
          break;
          
        case 'analista-requisitos':
          result = {
            success: true,
            message: 'Análise de requisitos concluída com sucesso',
            details: {
              documentosAnalisados: 3,
              requisitosIdentificados: 7,
              problemasPotenciais: 2,
              classificacaoCaso: 'Direito Civil - Indenizatório',
              documentacaoCompleta: false,
              documentosAdicionaisNecessarios: ['Comprovante de residência', 'Histórico médico completo']
            }
          };
          addNotification('success', 'Análise Concluída', 'O analista de requisitos concluiu o processamento dos documentos.', 'case');
          break;

        case 'estrategista':
          result = {
            success: true,
            message: 'Estratégia jurídica desenvolvida com sucesso',
            details: {
              estrategiasRecomendadas: [
                'Abordagem conciliatória inicial',
                'Preparação para litígio se necessário'
              ],
              jurisprudenciasFavoraveis: 5,
              jurisprudenciasDesfavoraveis: 2,
              riscoIdentificado: 'Médio',
              chancesExito: '65%',
              estimativaDuracao: '8 meses'
            }
          };
          addNotification('info', 'Estratégia Desenvolvida', 'O estrategista criou recomendações para o caso.', 'case');
          break;

        case 'analista-fatos':
          result = {
            success: true,
            message: 'Análise de fatos concluída',
            details: {
              cronologiaExtraida: true,
              fatosRelevantes: 8,
              questoesJuridicasIdentificadas: 3,
              fontesDeProva: ['Documentos', 'Depoimentos', 'Perícia']
            }
          };
          addNotification('success', 'Fatos Analisados', 'O analista de fatos organizou a cronologia e questões relevantes.', 'case');
          break;

        case 'pesquisador':
          result = {
            success: true,
            message: 'Pesquisa jurídica concluída',
            details: {
              fontesPesquisadas: 4,
              documentosEncontrados: 17,
              legislacaoAplicavel: ['Código Civil Art. 186', 'Código Civil Art. 927'],
              jurisprudenciaRelevante: 8,
              doutrinaAplicavel: 3
            }
          };
          addNotification('info', 'Pesquisa Finalizada', 'O pesquisador encontrou 17 documentos relevantes.', 'document');
          break;

        case 'analista-argumentacao':
          result = {
            success: true,
            message: 'Argumentação estruturada com sucesso',
            details: {
              argumentosPrincipais: 4,
              contraArgumentos: 3,
              forcaArgumentativa: 'Alta',
              basesFaticas: 6,
              basesJuridicas: 5
            }
          };
          addNotification('success', 'Argumentação Definida', 'O analista de argumentação estruturou a linha argumentativa.', 'case');
          break;

        case 'redator':
        case 'assistente-redacao':
          result = {
            success: true,
            message: 'Documento redigido com sucesso',
            details: {
              tipoDocumento: 'Petição Inicial',
              paginas: 8,
              anexos: 3,
              palavrasTotal: 5280,
              secoes: ['Fatos', 'Fundamentação', 'Pedidos', 'Provas']
            }
          };
          addNotification('success', 'Documento Gerado', 'O redator jurídico criou um novo documento.', 'document');
          break;

        case 'especialista':
          result = {
            success: true,
            message: 'Análise especializada concluída',
            details: {
              areaEspecializada: 'Direito do Consumidor',
              conceitosEspecificos: ['Responsabilidade objetiva', 'Inversão do ônus da prova'],
              legislacaoEspecifica: ['CDC Art. 14', 'CDC Art. 6º'],
              orientacaoEspecializada: 'Foco na falha da prestação de serviços'
            }
          };
          addNotification('info', 'Análise Especializada', 'O especialista forneceu orientação técnica para o caso.', 'case');
          break;

        case 'revisor-legal':
          result = {
            success: true,
            message: 'Revisão legal concluída',
            details: {
              pontosVerificados: 12,
              correcoesRecomendadas: 3,
              citacoesVerificadas: true,
              normativaAtualizada: true,
              nivelConformidade: 'Alto'
            }
          };
          addNotification('info', 'Revisão Concluída', 'O revisor legal finalizou a análise dos documentos.', 'document');
          break;

        case 'revisor-texto':
          result = {
            success: true,
            message: 'Revisão textual concluída',
            details: {
              errosGramaticais: 5,
              inconsistenciasEstilisticas: 2,
              clareza: 'Alta',
              formatacaoAjustada: true,
              documentoConsolidado: true
            }
          };
          addNotification('success', 'Texto Revisado', 'O revisor textual finalizou as correções no documento.', 'document');
          break;

        case 'comunicador':
          result = {
            success: true,
            message: 'Comunicação preparada',
            details: {
              tipoMaterial: 'Apresentação para cliente',
              slides: 12,
              resumoAdaptado: true,
              linguagemSimplificada: true,
              materialAdicional: ['FAQ', 'Linha do tempo visual']
            }
          };
          addNotification('info', 'Comunicação Pronta', 'O comunicador preparou materiais para o cliente.', 'case');
          break;

        default:
          result = {
            success: false,
            message: 'Agente não reconhecido'
          };
      }

      // Usar o formato de toast com sonner para uma experiência melhor
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
