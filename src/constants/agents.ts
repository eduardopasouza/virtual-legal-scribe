
import { AgentType } from '@/hooks/agent/types';

export const agents = [
  {
    type: 'coordenador',
    name: 'Coordenador Geral',
    description: 'Orquestra o pipeline, distribui tarefas, monitora prazos e alertas',
    avatar: '/placeholder.svg',
    role: 'Coordenador Geral'
  },
  {
    type: 'analista-requisitos',
    name: 'Analista de Requisitos',
    description: 'Especialista em triagem inicial, classifica casos e gera briefing',
    avatar: '/placeholder.svg',
    role: 'Analista de Requisitos'
  },
  {
    type: 'estrategista',
    name: 'Estrategista Jurídico',
    description: 'Avalia viabilidade, mapeia riscos e define objetivos estratégicos',
    avatar: '/placeholder.svg',
    role: 'Estrategista Jurídico'
  },
  {
    type: 'analista-fatos',
    name: 'Analista de Fatos',
    description: 'Extrai cronologia, mapeia fatos e formula questões jurídicas relevantes',
    avatar: '/placeholder.svg',
    role: 'Analista de Fatos'
  },
  {
    type: 'pesquisador',
    name: 'Pesquisador Jurídico',
    description: 'Pesquisa legislação, jurisprudência e doutrina aplicáveis',
    avatar: '/placeholder.svg',
    role: 'Pesquisador Jurídico'
  },
  {
    type: 'analista-argumentacao',
    name: 'Analista de Argumentação',
    description: 'Estrutura argumentos e contra-argumentos, avalia premissas',
    avatar: '/placeholder.svg',
    role: 'Analista de Argumentação'
  },
  {
    type: 'redator',
    name: 'Redator Jurídico',
    description: 'Elabora rascunhos de peças, aplica modelos e formatação',
    avatar: '/placeholder.svg',
    role: 'Redator Jurídico'
  },
  {
    type: 'assistente-redacao',
    name: 'Assistente de Redação',
    description: 'Auxilia na estruturação e formatação de documentos jurídicos',
    avatar: '/placeholder.svg',
    role: 'Assistente de Redação'
  },
  {
    type: 'especialista',
    name: 'Especialista Adaptável',
    description: 'Auto-capacita-se na área do direito requerida para casos específicos',
    avatar: '/placeholder.svg',
    role: 'Especialista Adaptável'
  },
  {
    type: 'revisor-legal',
    name: 'Verificador de Conformidade',
    description: 'Verifica requisitos formais, citações, formatação e integridade',
    avatar: '/placeholder.svg',
    role: 'Verificador de Conformidade'
  },
  {
    type: 'revisor-integrador',
    name: 'Revisor & Integrador',
    description: 'Realiza revisão textual, gramática jurídica e formatação final',
    avatar: '/placeholder.svg',
    role: 'Revisor & Integrador'
  },
  {
    type: 'revisor-texto',
    name: 'Revisor de Texto',
    description: 'Realiza revisão ortográfica e gramatical, melhoria da linguagem',
    avatar: '/placeholder.svg',
    role: 'Revisor de Texto'
  },
  {
    type: 'comunicador',
    name: 'Comunicador com Cliente',
    description: 'Interface de feedback, gera apresentações e registra comunicações',
    avatar: '/placeholder.svg',
    role: 'Comunicador com Cliente'
  },
  {
    type: 'arquivista',
    name: 'Arquivista Digital',
    description: 'Classifica, organiza e gerencia documentos no sistema',
    avatar: '/placeholder.svg',
    role: 'Arquivista Digital'
  },
  {
    type: 'extrator-dados',
    name: 'Extrator de Dados Processuais',
    description: 'Extrai e indexa dados relevantes de documentos jurídicos',
    avatar: '/placeholder.svg',
    role: 'Extrator de Dados Processuais'
  },
  {
    type: 'secretaria',
    name: 'Secretária Virtual',
    description: 'Gerencia calendário, compromissos e comunicações',
    avatar: '/placeholder.svg',
    role: 'Secretária Virtual'
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
  'especialista-adaptavel': [
    'Analise os aspectos constitucionais deste caso',
    'Quais implicações de direito internacional existem?',
    'Avalie os aspectos interdisciplinares relevantes',
    'Analise os documentos técnicos deste caso'
  ],
  'revisor-legal': [
    'Este documento está em conformidade?',
    'Verifique as citações e referências',
    'O que precisa ser ajustado formalmente?'
  ],
  'revisor-integrador': [
    'Revise a fluidez e coesão do texto',
    'Unifique a terminologia jurídica',
    'Elimine redundâncias no documento',
    'Aplique melhorias de estilo ao texto'
  ],
  'revisor-texto': [
    'Revise a gramática e o estilo deste texto',
    'Como integrar todas as partes do documento?',
    'Verifique a formatação final'
  ],
  'comunicador': [
    'Prepare um resumo executivo para o cliente',
    'Explique os termos técnicos em linguagem simples',
    'Quais são as perguntas frequentes sobre este caso?',
    'Gere uma apresentação do caso para o cliente',
    'Como devo explicar esse documento ao cliente?'
  ],
  'assistente-redacao': [
    'Gerar rascunho do documento',
    'Aplicar modelo padrão de petição',
    'Verificar formatação do documento',
    'Adaptar linguagem jurídica',
    'Preparar minuta inicial'
  ],
  'arquivista': [
    'Classificar tipos de documentos',
    'Sugerir estrutura de organização',
    'Identificar duplicidades documentais',
    'Como deve ser a nomenclatura padronizada?',
    'Quais documentos estão faltando neste caso?'
  ],
  'extrator-dados': [
    'Extrair movimentações processuais',
    'Identificar eventos-chave',
    'Mapear números de folhas importantes',
    'Extrair prazos do documento',
    'Listar partes envolvidas no processo'
  ],
  'secretaria': [
    'Agendar compromissos da próxima semana',
    'Resumir emails não respondidos',
    'Identificar conflitos de agenda',
    'Preparar relatório de atividades diárias',
    'Sugerir horários disponíveis para reunião'
  ]
};
