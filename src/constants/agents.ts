
import { AgentType } from '@/hooks/useAgentSimulation';
import { AgentOption } from '@/types/agent-chat';

export const agentOptions: AgentOption[] = [
  {
    value: 'analista-requisitos',
    label: 'Analista de Requisitos',
    description: 'Especialista em extrair informações e identificar requisitos legais de documentos'
  },
  {
    value: 'estrategista',
    label: 'Estrategista',
    description: 'Desenvolve estratégias jurídicas e planos de ação para o caso'
  },
  {
    value: 'revisor-legal',
    label: 'Revisor Legal',
    description: 'Verifica aspectos legais e conformidade com a legislação'
  },
  {
    value: 'assistente-redacao',
    label: 'Assistente de Redação',
    description: 'Ajuda a elaborar e estruturar documentos jurídicos'
  },
  {
    value: 'pesquisador',
    label: 'Pesquisador',
    description: 'Busca jurisprudência e referências legais relevantes'
  }
];

export const suggestionsByAgent: Record<AgentType, string[]> = {
  'analista-requisitos': [
    'O que você pode identificar neste documento?',
    'Quais são os principais pontos de atenção?',
    'Quais documentos adicionais preciso fornecer?'
  ],
  'estrategista': [
    'Qual sua recomendação para este caso?',
    'Quais são os riscos envolvidos?',
    'Qual a probabilidade de sucesso?'
  ],
  'revisor-legal': [
    'Este documento está conforme a legislação?',
    'Há alguma inconsistência legal?',
    'Quais são os pontos fortes e fracos?'
  ],
  'assistente-redacao': [
    'Ajude-me a redigir uma resposta',
    'Como posso melhorar este argumento?',
    'Preciso de um modelo de petição'
  ],
  'pesquisador': [
    'Busque jurisprudência sobre este assunto',
    'Quais precedentes se aplicam a este caso?',
    'Encontre legislação relacionada a este tema'
  ]
};
