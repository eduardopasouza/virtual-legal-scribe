
import { WorkflowDefinition } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const estrategistaWorkflow: WorkflowDefinition = {
  id: uuidv4(),
  name: 'Fluxo EVJI com Estrategista',
  description: 'Fluxo de trabalho jurídico com intervenções estratégicas em três fases',
  initialStage: 'reception',
  stages: [
    {
      name: 'reception',
      displayName: 'Recepção e Triagem',
      description: 'Recepção do caso e análise inicial de documentos',
      primaryAgent: 'analista-requisitos',
      supportAgents: ['coordenador'],
      nextStage: 'planning',
      requiredDocuments: ['identification', 'initial_petition']
    },
    {
      name: 'planning',
      displayName: 'Planejamento Estratégico Inicial',
      description: 'Definição da estratégia inicial do caso',
      primaryAgent: 'estrategista',
      supportAgents: ['coordenador'],
      nextStage: 'analysis',
      previousStage: 'reception'
    },
    {
      name: 'analysis',
      displayName: 'Análise Jurídica',
      description: 'Análise detalhada dos fatos e questões jurídicas',
      primaryAgent: 'analista-fatos',
      supportAgents: ['analista-argumentacao', 'coordenador'],
      nextStage: 'research',
      previousStage: 'planning'
    },
    {
      name: 'research',
      displayName: 'Pesquisa e Fundamentação',
      description: 'Pesquisa de legislação, doutrina e jurisprudência',
      primaryAgent: 'pesquisador',
      supportAgents: ['especialista', 'coordenador'],
      nextStage: 'strategy-review',
      previousStage: 'analysis'
    },
    {
      name: 'strategy-review',
      displayName: 'Revisão Estratégica',
      description: 'Revisão e ajuste da estratégia com base nas análises e pesquisas',
      primaryAgent: 'estrategista',
      supportAgents: ['coordenador'],
      nextStage: 'drafting',
      previousStage: 'research'
    },
    {
      name: 'drafting',
      displayName: 'Elaboração de Documento',
      description: 'Redação do documento jurídico baseado na estratégia definida',
      primaryAgent: 'redator',
      supportAgents: ['assistente-redacao'],
      nextStage: 'strategic-validation',
      previousStage: 'strategy-review'
    },
    {
      name: 'strategic-validation',
      displayName: 'Validação Estratégica',
      description: 'Verificação final do alinhamento estratégico do documento',
      primaryAgent: 'estrategista',
      supportAgents: ['coordenador'],
      nextStage: 'review',
      previousStage: 'drafting'
    },
    {
      name: 'review',
      displayName: 'Verificação e Revisão',
      description: 'Revisão técnica e gramatical do documento',
      primaryAgent: 'revisor-legal',
      supportAgents: ['revisor-texto'],
      nextStage: 'delivery',
      previousStage: 'strategic-validation'
    },
    {
      name: 'delivery',
      displayName: 'Entrega e Feedback',
      description: 'Entrega do documento e coleta de feedback',
      primaryAgent: 'comunicador',
      supportAgents: ['coordenador'],
      previousStage: 'review'
    }
  ],
  transitions: [
    { from: 'reception', to: 'planning' },
    { from: 'planning', to: 'analysis' },
    { from: 'analysis', to: 'research' },
    { from: 'research', to: 'strategy-review' },
    { from: 'strategy-review', to: 'drafting' },
    { from: 'drafting', to: 'strategic-validation' },
    { from: 'strategic-validation', to: 'review' },
    { from: 'review', to: 'delivery' }
  ]
};
