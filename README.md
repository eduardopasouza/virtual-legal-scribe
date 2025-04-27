
# EVJI - Escritório Virtual Jurídico Inteligente

## Visão Geral

O EVJI (Escritório Virtual Jurídico Inteligente) é uma plataforma projetada para estender as capacidades de advogados, escritórios jurídicos e departamentos legais. Este sistema processa casos jurídicos de forma semi-autônoma através de agentes de IA especializados, mantendo o profissional do direito no controle final das decisões.

O EVJI automatiza tarefas como:
- Recepção e triagem de casos
- Análise de documentos jurídicos
- Pesquisa de legislação e jurisprudência
- Estruturação de argumentos jurídicos
- Elaboração de minutas e peças processuais
- Revisão e verificação de conformidade legal

## Arquitetura

O projeto é construído com as seguintes tecnologias:

- **Frontend**: Vite, TypeScript, React, Tailwind CSS e shadcn-ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Orquestração**: n8n para workflows e webhooks
- **IA**: LangChain para coordenar agentes de IA
- **Auxiliares**: Vector DB (busca semântica), OCR (extração de texto de documentos)

## Agentes de IA

O EVJI utiliza 11 agentes especializados:

1. **Coordenador Geral**: Orquestra o fluxo de trabalho, distribui tarefas e monitora prazos
2. **Analista de Requisitos**: Realiza triagem inicial, classifica casos e gera briefings
3. **Estrategista Jurídico**: Avalia viabilidade, mapeia riscos e define objetivos estratégicos
4. **Analista de Fatos**: Extrai cronologia, mapeia fatos e identifica questões jurídicas relevantes
5. **Pesquisador Jurídico**: Pesquisa legislação, jurisprudência e doutrina aplicáveis
6. **Analista de Argumentação**: Estrutura argumentos e contra-argumentos, avalia premissas
7. **Redator Jurídico**: Elabora rascunhos de peças processuais
8. **Especialista Adaptável**: Auto-capacita-se na área do direito específica para casos especiais
9. **Verificador de Conformidade**: Verifica requisitos formais, citações e formatação
10. **Revisor & Integrador**: Realiza revisão textual e formatação final
11. **Comunicador com Cliente**: Interface de feedback e geração de apresentações

## Fluxo de Trabalho

O EVJI processa casos em 7 etapas principais:

1. **Recepção & Triagem**: Classificação e geração de briefing
2. **Planejamento Estratégico**: Definição do plano de ação inicial
3. **Análise de Fatos & Questões**: Extração de fatos e questões jurídicas
4. **Pesquisa & Fundamentação**: Busca por legislação e jurisprudência
5. **Elaboração de Documento**: Estruturação de argumentos e redação
6. **Verificação & Revisão**: Verificação de conformidade e revisão textual
7. **Entrega & Feedback**: Apresentação ao cliente e coleta de feedback

## Começando

### Requisitos

- Node.js 18+ e npm
- Conta no Supabase (para backend e armazenamento)
- Conta no n8n (opcional, para fluxos de trabalho avançados)

### Instalação

```sh
# Clone o repositório
git clone <URL_DO_REPOSITORIO>
cd evji

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# Inicie o servidor de desenvolvimento
npm run dev
```

### Configurando o Supabase

1. Crie um projeto no [Supabase](https://supabase.io)
2. Execute os scripts SQL disponíveis na pasta `/supabase/migrations`
3. Configure as políticas RLS (Row-Level Security)
4. Obtenha a URL e a chave anônima para configurar as variáveis de ambiente

### Uso Básico

1. **Login**: Acesse o sistema com suas credenciais
2. **Criar Caso**: Na página inicial, clique em "Novo Caso" e preencha os detalhes
3. **Upload de Documentos**: Anexe os documentos relacionados ao caso
4. **Acionar Agentes**: Utilize os agentes de IA específicos para cada etapa do processo
5. **Acompanhamento**: Visualize o progresso e os resultados na timeline do caso
6. **Finalização**: Revise, edite e aprove os documentos gerados antes da entrega

## Contribuição

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre como contribuir para este projeto.

## Licença

Este projeto é licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Suporte

Para suporte, envie um email para [suporte@evji.com.br](mailto:suporte@evji.com.br) ou abra uma issue no GitHub.

## URL do Projeto

**URL**: https://lovable.dev/projects/31b1526b-25be-49da-8448-081ba6a34069
