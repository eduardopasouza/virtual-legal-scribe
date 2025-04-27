
import { AgentType } from '@/hooks/useAgentSimulation';

export const agents = [
  {
    type: 'analista-requisitos',
    name: 'Analista de Requisitos',
    description: 'Especialista em extrair informações e identificar requisitos legais de documentos'
  },
  {
    type: 'estrategista',
    name: 'Estrategista',
    description: 'Desenvolve estratégias jurídicas e planos de ação para o caso'
  },
  {
    type: 'revisor-legal',
    name: 'Revisor Legal',
    description: 'Verifica aspectos legais e conformidade com a legislação'
  },
  {
    type: 'assistente-redacao',
    name: 'Assistente de Redação',
    description: 'Ajuda a elaborar e estruturar documentos jurídicos'
  },
  {
    type: 'pesquisador',
    name: 'Pesquisador',
    description: 'Busca jurisprudência e referências legais relevantes'
  }
];

// Exportações adicionais para uso nos componentes
export const agentOptions = agents.map(agent => ({
  value: agent.type as AgentType,
  label: agent.name,
  description: agent.description
}));

export const suggestionsByAgent: Record<AgentType, string[]> = {
  'analista-requisitos': [
    'Quais são os requisitos deste caso?',
    'Poderia extrair as informações principais?',
    'Qual a legislação aplicável?'
  ],
  'estrategista': [
    'Qual a melhor estratégia para este caso?',
    'Quais os pontos fortes e fracos?',
    'Qual o próximo passo recomendado?'
  ],
  'revisor-legal': [
    'Este documento está em conformidade?',
    'Existem problemas legais a considerar?',
    'O que precisa ser revisado?'
  ],
  'assistente-redacao': [
    'Como posso melhorar este documento?',
    'Preciso de ajuda para redigir uma petição',
    'Sugestões de estrutura para este documento'
  ],
  'pesquisador': [
    'Encontre jurisprudência relacionada',
    'Busque precedentes sobre este tema',
    'Quais referências legais são relevantes?'
  ]
};
