
# EVJI - Escritório Virtual Jurídico Inteligente

## Sobre o Projeto

O EVJI (Escritório Virtual Jurídico Inteligente) é uma plataforma que estende as capacidades de profissionais jurídicos através de automação e agentes de IA. O sistema processa casos de forma semi-autônoma mantendo o profissional no controle final das decisões.

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

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Faça commit das alterações
4. Push para a branch
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.
