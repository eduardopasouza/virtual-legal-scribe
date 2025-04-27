
import { AgentType } from '@/hooks/useAgentSimulation';

export const agents = [
  {
    type: 'coordenador',
    name: 'Coordenador Geral',
    description: 'Orquestra o pipeline, distribui tarefas, monitora prazos e alertas'
  },
  {
    type: 'analista-requisitos',
    name: 'Analista de Requisitos',
    description: 'Especialista em triagem inicial, classifica casos e gera briefing'
  },
  {
    type: 'estrategista',
    name: 'Estrategista Jurídico',
    description: 'Avalia viabilidade, mapeia riscos e define objetivos estratégicos'
  },
  {
    type: 'analista-fatos',
    name: 'Analista de Fatos',
    description: 'Extrai cronologia, mapeia fatos e formula questões jurídicas relevantes'
  },
  {
    type: 'pesquisador',
    name: 'Pesquisador Jurídico',
    description: 'Pesquisa legislação, jurisprudência e doutrina aplicáveis'
  },
  {
    type: 'analista-argumentacao',
    name: 'Analista de Argumentação',
    description: 'Estrutura argumentos e contra-argumentos, avalia premissas'
  },
  {
    type: 'redator',
    name: 'Redator Jurídico',
    description: 'Elabora rascunhos de peças, aplica modelos e formatação'
  },
  {
    type: 'especialista',
    name: 'Especialista Adaptável',
    description: 'Auto-capacita-se na área do direito requerida para casos específicos'
  },
  {
    type: 'revisor-legal',
    name: 'Verificador de Conformidade',
    description: 'Verifica requisitos formais, citações, formatação e integridade'
  },
  {
    type: 'revisor-texto',
    name: 'Revisor & Integrador',
    description: 'Realiza revisão textual, gramática jurídica e formatação final'
  },
  {
    type: 'comunicador',
    name: 'Comunicador com Cliente',
    description: 'Interface de feedback, gera apresentações e registra comunicações'
  }
];

// Exportações adicionais para uso nos componentes
export const agentOptions = agents.map(agent => ({
  value: agent.type as AgentType,
  label: agent.name,
  description: agent.description
}));

export const suggestionsByAgent: Record<AgentType, string[]> = {
  'coordenador': [
    'Mostre o status atual do caso',
    'Quais são os próximos passos?',
    'Existe algum alerta para este caso?'
  ],
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
  'analista-fatos': [
    'Extraia a cronologia dos fatos',
    'Quais são as questões jurídicas principais?',
    'Como classificar a relevância dos fatos?'
  ],
  'pesquisador': [
    'Encontre jurisprudência relacionada',
    'Busque precedentes sobre este tema',
    'Quais referências legais são relevantes?'
  ],
  'analista-argumentacao': [
    'Estruture os principais argumentos',
    'Quais são os contra-argumentos possíveis?',
    'Como avaliar a força das premissas?'
  ],
  'redator': [
    'Gere um rascunho de petição inicial',
    'Elabore um modelo de contestação',
    'Como formatar adequadamente este documento?'
  ],
  'especialista': [
    'Explique os conceitos específicos desta área',
    'Quais são as particularidades deste tipo de caso?',
    'Forneça conhecimento especializado sobre este tema'
  ],
  'revisor-legal': [
    'Este documento está em conformidade?',
    'Verifique as citações e referências',
    'O que precisa ser ajustado formalmente?'
  ],
  'revisor-texto': [
    'Revise a gramática e o estilo deste texto',
    'Como integrar todas as partes do documento?',
    'Verifique a formatação final'
  ],
  'comunicador': [
    'Prepare uma apresentação para o cliente',
    'Como explicar este caso de forma simplificada?',
    'Registre as comunicações com o cliente'
  ]
};
