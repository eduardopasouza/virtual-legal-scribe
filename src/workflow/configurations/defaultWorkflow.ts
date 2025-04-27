
import { WorkflowDefinition } from '../types';

export const defaultWorkflow: WorkflowDefinition = {
  id: 'default-legal-workflow',
  name: 'Fluxo Jurídico Padrão',
  description: 'Fluxo de trabalho padrão para casos jurídicos',
  initialStage: 'reception',
  stages: [
    {
      name: 'reception',
      displayName: 'Recepção e Triagem',
      description: 'Entrada de documentos e classificação inicial do caso',
      primaryAgent: 'analista-requisitos',
      supportAgents: ['coordenador'],
    },
    {
      name: 'planning',
      displayName: 'Planejamento Estratégico',
      description: 'Definição da estratégia jurídica e mapeamento de riscos',
      primaryAgent: 'estrategista',
      supportAgents: ['coordenador', 'analista-requisitos'],
      previousStage: 'reception',
    },
    {
      name: 'analysis',
      displayName: 'Análise Jurídica',
      description: 'Análise detalhada dos fatos e questões jurídicas',
      primaryAgent: 'analista-fatos',
      supportAgents: ['especialista', 'revisor-legal'],
      previousStage: 'planning',
    },
    {
      name: 'research',
      displayName: 'Pesquisa e Fundamentação',
      description: 'Pesquisa de jurisprudência e doutrina relevante',
      primaryAgent: 'pesquisador',
      supportAgents: ['analista-argumentacao'],
      previousStage: 'analysis',
    },
    {
      name: 'drafting',
      displayName: 'Redação de Documento',
      description: 'Elaboração das peças jurídicas',
      primaryAgent: 'redator',
      supportAgents: ['assistente-redacao'],
      previousStage: 'research',
    },
    {
      name: 'review',
      displayName: 'Revisão e Verificação',
      description: 'Revisão técnica e garantia de qualidade',
      primaryAgent: 'revisor-legal',
      supportAgents: ['revisor-texto'],
      previousStage: 'drafting',
    },
    {
      name: 'delivery',
      displayName: 'Entrega e Feedback',
      description: 'Finalização e apresentação ao cliente',
      primaryAgent: 'comunicador',
      supportAgents: ['coordenador'],
      previousStage: 'review',
    },
  ],
  transitions: [
    { from: 'reception', to: 'planning', autoAdvance: false },
    { from: 'planning', to: 'analysis', autoAdvance: false },
    { from: 'analysis', to: 'research', autoAdvance: false },
    { from: 'research', to: 'drafting', autoAdvance: false },
    { from: 'drafting', to: 'review', autoAdvance: false },
    { from: 'review', to: 'delivery', autoAdvance: false },
  ]
};
