
# Guia de Integração EVJI com n8n e APIs externas

## Visão Geral

Este guia documenta como configurar e utilizar o sistema EVJI para integração com:

- **n8n** - Plataforma de automação de fluxo de trabalho
- **Google APIs** (Gmail, Google Calendar, Google Drive)
- **Microsoft APIs** (OneDrive)
- **OpenAI GPT-4o**

## Arquitetura do Sistema

O EVJI utiliza uma arquitetura de integração baseada em eventos, onde o n8n atua como um intermediário (middleware) entre os agentes de IA do EVJI e as APIs externas. Isso permite uma comunicação eficiente e automatizada entre os diferentes componentes do sistema.

```
┌──────────┐    ┌──────────┐    ┌──────────────────┐
│   EVJI   │    │   n8n    │    │ External Services│
│  Agents  │<-->│ Workflows│<-->│ (Google, MS,     │
│          │    │          │    │  OpenAI)         │
└──────────┘    └──────────┘    └──────────────────┘
```

## Pré-requisitos

1. Servidor n8n configurado (autogerenciado ou na nuvem)
2. Contas de serviço configuradas:
   - Projeto Google Cloud com APIs habilitadas
   - Registro de aplicativo Microsoft Azure AD
   - Conta OpenAI com acesso à API GPT-4o

## Configuração do n8n

### Instalação do n8n

Para instalar o n8n, siga as [instruções oficiais](https://docs.n8n.io/hosting/).

### Configuração de Workflows Básicos

1. **Workflow de Processamento de Email**
   - Gatilho: Webhook
   - Nós: Gmail, JSON Parse, HTTP Request, Function
   - Função: Extrair informações de emails e enviar para o EVJI

2. **Workflow de Sincronização de Calendário**
   - Gatilho: Schedule (intervalo regular)
   - Nós: Google Calendar, HTTP Request
   - Função: Sincronizar eventos entre Google Calendar e EVJI

3. **Workflow de Gestão de Documentos**
   - Gatilho: Webhook
   - Nós: Google Drive/OneDrive, HTTP Request
   - Função: Gerenciar documentos entre serviços de armazenamento e EVJI

## Configuração das APIs Externas

### Google Cloud Platform

1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/)
2. Habilite as APIs:
   - Gmail API
   - Google Calendar API
   - Google Drive API
3. Configure as Credenciais OAuth:
   - Tipo: Aplicação Web
   - URIs de redirecionamento: `https://seu-servidor-n8n.com/oauth2/callback` e `https://sua-aplicacao-evji.com/auth/google/callback`
4. Anote o ID do Cliente e o Segredo do Cliente

### Microsoft Azure AD

1. Registre um novo aplicativo no [Portal Azure](https://portal.azure.com/)
2. Configure as permissões para OneDrive
3. Adicione URIs de redirecionamento: `https://seu-servidor-n8n.com/oauth2/callback` e `https://sua-aplicacao-evji.com/auth/microsoft/callback`
4. Anote o ID do Aplicativo (Cliente) e o Segredo do Cliente

### OpenAI

1. Crie uma conta na [OpenAI Platform](https://platform.openai.com/)
2. Gere uma API Key
3. Anote a API Key

## Configuração do EVJI

1. Acesse a página de Integrações no EVJI
2. Configure cada serviço:
   - **n8n**: Cole a URL do webhook do servidor n8n
   - **Google**: Cole o ID do Cliente OAuth do projeto GCP
   - **Microsoft**: Cole o ID do Cliente OAuth do registro Azure AD
   - **OpenAI**: Cole a API Key

## Fluxos de Trabalho Recomendados

### Integração de Email (Gmail)

1. **Monitoramento de Caixa de Entrada**
   - n8n monitora emails recebidos no Gmail
   - Filtra emails relevantes para casos
   - Encaminha para análise pelos agentes do EVJI

2. **Classificação de Emails**
   - n8n extrai metadados e conteúdo
   - Agente de IA classifica por tipo e urgência
   - EVJI organiza os emails por caso

3. **Respostas Automatizadas**
   - Agente de IA gera resposta preliminar
   - n8n envia resposta via Gmail
   - EVJI registra a comunicação

### Integração com Calendário

1. **Sincronização Bidirecional**
   - Eventos criados no EVJI são sincronizados com Google Calendar
   - Eventos do Google Calendar são importados para o EVJI
   - n8n gerencia conflitos e atualizações

2. **Lembretes e Notificações**
   - n8n monitora prazos e compromissos
   - Envia lembretes via email/notificação
   - Agente Secretária prepara informações relevantes

### Gestão de Documentos

1. **Sincronização de Arquivos**
   - Documentos são sincronizados entre EVJI e Google Drive/OneDrive
   - n8n organiza arquivos em pastas por caso
   - Mantém versões e histórico de modificações

2. **Extração de Dados**
   - n8n envia documentos para processamento pelo GPT-4o
   - Agente Extrator de Dados analisa e extrai informações
   - Resultados são armazenados no EVJI

## Monitoramento e Manutenção

1. **Verificação de Saúde**
   - Verifique regularmente o status das integrações na página de Integrações
   - Teste as conexões para garantir que estão funcionando corretamente

2. **Renovação de Credenciais**
   - Atualize as credenciais OAuth antes que expirem
   - Verifique limites de uso das APIs

3. **Ajustes de Workflows**
   - Modifique os workflows no n8n conforme necessário
   - Atualize as URLs de webhook no EVJI quando mudar configurações no n8n

## Solução de Problemas

### Problemas Comuns e Soluções

1. **Erro de Autenticação**
   - Verifique se as credenciais estão corretas e não expiraram
   - Renove tokens OAuth conforme necessário

2. **Falha na Execução de Workflow**
   - Verifique os logs no n8n
   - Teste o webhook manualmente
   - Verifique se todos os nós estão configurados corretamente

3. **Sincronização Falha**
   - Verifique permissões nas APIs externas
   - Confirme limites de quota das APIs
   - Verifique integridade da conexão de rede

## Recursos Adicionais

- [Documentação do n8n](https://docs.n8n.io/)
- [APIs do Google Cloud](https://cloud.google.com/apis)
- [Microsoft Graph API](https://developer.microsoft.com/en-us/graph)
- [API OpenAI](https://platform.openai.com/docs/api-reference)

## Suporte

Para suporte com integrações, entre em contato com nossa equipe técnica.
