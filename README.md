
# EVJI - Escritório Virtual Jurídico Inteligente

## Sobre o Projeto

O EVJI (Escritório Virtual Jurídico Inteligente) é uma plataforma que estende as capacidades de profissionais jurídicos através de automação e agentes de IA. O sistema processa casos de forma semi-autônoma mantendo o profissional no controle final das decisões.

**IMPORTANTE**: O EVJI é uma ferramenta de suporte automatizado e NÃO substitui o aconselhamento jurídico profissional. Todo conteúdo gerado deve ser revisado e validado por profissionais qualificados antes de seu uso oficial.

## Configuração do Ambiente

### Pré-requisitos

- Node.js 18+
- Conta no Supabase

### Variáveis de Ambiente

1. Copie o arquivo `.env.example` para criar um novo arquivo `.env` na raiz do projeto:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e atualize com suas credenciais do Supabase:
   ```env
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_anonima_do_supabase
   ```

> **Importante:** Nunca comite o arquivo `.env` para o repositório.

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npm run dev
```

## Gestão de Projeto

Utilizamos GitHub Issues e Projects para gerenciar o desenvolvimento do EVJI:

### Issues

Todas as tarefas, bugs e solicitações de recursos são rastreados como GitHub Issues:

- Use o modelo adequado ao criar uma nova issue
- Inclua descrições detalhadas, critérios de aceitação e exemplos
- Aplique etiquetas para categorizar a issue (bug, enhancement, frontend, etc.)

### Projeto Kanban

Utilizamos GitHub Projects com uma abordagem Kanban:

- **To Do**: Issues prontas para serem trabalhadas
- **In Progress**: Issues sendo trabalhadas atualmente
- **Review**: PRs aguardando revisão
- **Done**: Issues completadas e PRs mesclados

[Link para o Project Board](https://github.com/seu-usuario/seu-repo/projects/1) (atualize com o link real)

### Como Contribuir

Veja nosso [Guia de Contribuição](CONTRIBUTING.md) para instruções detalhadas sobre como contribuir para o EVJI.

## Estrutura do Banco de Dados

O EVJI utiliza o Supabase como backend. As principais tabelas são:

### Cases (Casos)
- Armazena informações sobre casos jurídicos
- Campos principais: id, título, cliente, descrição, status, tipo

### Activities (Atividades)
- Registra ações realizadas em cada caso
- Campos principais: case_id, agent, action, status

### Documents (Documentos)
- Gerencia documentos relacionados aos casos
- Campos principais: case_id, name, type, file_path

### Workflow_Stages (Estágios do Fluxo)
- Controla o progresso dos casos através do workflow
- Campos principais: case_id, stage_name, status, stage_number

## Fluxo de Trabalho

O sistema processa casos em 7 etapas principais:

1. **Recepção & Triagem**: Classificação inicial e briefing
2. **Planejamento**: Definição da estratégia
3. **Análise**: Extração de fatos e questões jurídicas
4. **Pesquisa**: Busca por legislação e jurisprudência
5. **Elaboração**: Estruturação e redação
6. **Revisão**: Verificação de conformidade
7. **Entrega**: Apresentação ao cliente

## Status do Build

[![Continuous Integration](https://github.com/seu-usuario/seu-repo/actions/workflows/ci.yml/badge.svg)](https://github.com/seu-usuario/seu-repo/actions/workflows/ci.yml)

## Aviso Legal

O EVJI é uma plataforma de assistência que utiliza inteligência artificial. É importante compreender que:

- O serviço NÃO substitui aconselhamento jurídico profissional
- Todo conteúdo gerado deve ser revisado e validado
- A plataforma não se responsabiliza por decisões tomadas sem validação profissional
- Os usuários devem ler e aceitar os Termos de Uso antes de utilizar o sistema

Para mais informações, consulte os Termos de Uso completos na plataforma.

## Arquitetura do Sistema

### Frontend
- React com TypeScript
- Tailwind CSS para estilização
- Shadcn/UI para componentes

### Backend (Supabase)
- PostgreSQL para armazenamento
- Row Level Security (RLS) para segurança
- Edge Functions para lógica personalizada

### Integração com IA
- Agentes especializados por função
- Coordenação central via workflow
- Processamento assíncrono de tarefas

## Licença

Este projeto está sob a licença MIT.
