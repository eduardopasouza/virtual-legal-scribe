
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIntegrations } from '@/hooks/useIntegrations';
import { IntegrationCard } from '@/components/integrations/IntegrationCard';
import { WorkflowCard } from '@/components/integrations/WorkflowCard';
import { toast } from 'sonner';

const IntegrationsPage = () => {
  const [activeTab, setActiveTab] = useState("services");
  const { 
    integrations, 
    workflows, 
    isLoading, 
    error, 
    connectIntegration, 
    disconnectIntegration,
    updateWorkflow,
    testConnection
  } = useIntegrations();

  const handleExecuteWorkflow = async (id: string) => {
    // In a real implementation, this would make an API call to execute the workflow
    toast.info(`Executando fluxo de trabalho ${workflows.find(w => w.id === id)?.name}...`);
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% chance of success
        if (success) {
          updateWorkflow(id, { lastExecuted: new Date() });
          toast.success(`Fluxo de trabalho executado com sucesso`);
        } else {
          toast.error(`Erro ao executar o fluxo de trabalho`);
        }
        resolve();
      }, 2000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Integrações</h1>
              <p className="text-muted-foreground">
                Configure integrações com n8n e serviços externos
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="services">Serviços</TabsTrigger>
                  <TabsTrigger value="workflows">Fluxos de Trabalho</TabsTrigger>
                  <TabsTrigger value="documentation">Documentação</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="services" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {integrations
                    .filter(integration => integration.provider === 'n8n')
                    .map(integration => (
                      <IntegrationCard 
                        key={integration.id}
                        integration={integration}
                        onConnect={connectIntegration}
                        onDisconnect={disconnectIntegration}
                        onTest={testConnection}
                      />
                    ))
                  }
                </div>
                
                <h2 className="text-xl font-semibold mt-8">Provedores de Serviço</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {integrations
                    .filter(integration => integration.provider !== 'n8n')
                    .map(integration => (
                      <IntegrationCard 
                        key={integration.id}
                        integration={integration}
                        onConnect={connectIntegration}
                        onDisconnect={disconnectIntegration}
                        onTest={testConnection}
                      />
                    ))
                  }
                </div>
              </TabsContent>

              <TabsContent value="workflows" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {workflows.map(workflow => (
                    <WorkflowCard 
                      key={workflow.id}
                      workflow={workflow}
                      onUpdate={updateWorkflow}
                      onExecute={handleExecuteWorkflow}
                    />
                  ))}
                </div>
                
                {workflows.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-48 text-center border border-dashed rounded-lg p-6">
                    <p className="text-muted-foreground">
                      Nenhum fluxo de trabalho configurado. Conecte o n8n para começar.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="documentation" className="mt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <h2>Configurando Integrações</h2>
                  
                  <h3>n8n</h3>
                  <p>
                    O n8n é uma plataforma de automação de fluxo de trabalho que permite conectar 
                    diferentes serviços e APIs para criar automações personalizadas.
                  </p>
                  <ol>
                    <li>Configure um servidor n8n (autogerenciado ou na nuvem)</li>
                    <li>Crie um fluxo de trabalho no n8n</li>
                    <li>Adicione um nó de gatilho Webhook</li>
                    <li>Copie a URL do webhook</li>
                    <li>Cole a URL na configuração da integração n8n no EVJI</li>
                    <li>Clique em "Conectar" e depois "Testar" para verificar a conexão</li>
                  </ol>

                  <h3>Google (Gmail, Calendar, Drive)</h3>
                  <p>
                    Para integrar com serviços Google, você precisará configurar um projeto no 
                    Google Cloud Platform e habilitar as APIs necessárias.
                  </p>
                  <ol>
                    <li>Crie um projeto no <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
                    <li>Habilite as APIs necessárias (Gmail, Calendar, Drive)</li>
                    <li>Configure as credenciais OAuth (ID do cliente e segredo)</li>
                    <li>Configure as URIs de redirecionamento autorizadas</li>
                    <li>Copie o ID do cliente e cole na configuração da integração Google no EVJI</li>
                  </ol>

                  <h3>Microsoft OneDrive</h3>
                  <p>
                    Para integrar com o OneDrive, você precisará registrar um aplicativo no portal 
                    Azure AD.
                  </p>
                  <ol>
                    <li>Acesse o <a href="https://portal.azure.com/" target="_blank" rel="noopener noreferrer">Portal Azure</a></li>
                    <li>Registre um novo aplicativo</li>
                    <li>Configure as permissões necessárias para o OneDrive</li>
                    <li>Adicione as URLs de redirecionamento</li>
                    <li>Copie o ID do cliente e cole na configuração da integração Microsoft no EVJI</li>
                  </ol>

                  <h3>GPT-4o</h3>
                  <p>
                    Para integrar com o GPT-4o da OpenAI, você precisará de uma API key.
                  </p>
                  <ol>
                    <li>Crie uma conta na <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer">OpenAI</a></li>
                    <li>Gere uma API key</li>
                    <li>Copie a API key e cole na configuração da integração GPT-4o no EVJI</li>
                  </ol>

                  <h2>Fluxos de Trabalho Recomendados</h2>
                  
                  <h3>Integração com Email (Gmail)</h3>
                  <p>Use n8n para:</p>
                  <ul>
                    <li>Monitorar a caixa de entrada e processar emails recebidos</li>
                    <li>Extrair dados de emails relacionados a casos</li>
                    <li>Encaminhar informações relevantes para os agentes de IA</li>
                    <li>Classificar e categorizar emails por tipo de caso</li>
                  </ul>

                  <h3>Integração com Calendário</h3>
                  <p>Use n8n para:</p>
                  <ul>
                    <li>Sincronizar eventos do Google Calendar com o calendário do EVJI</li>
                    <li>Criar lembretes automáticos para prazos judiciais</li>
                    <li>Enviar notificações antes de audiências e compromissos</li>
                    <li>Agendar reuniões com base na disponibilidade dos advogados</li>
                  </ul>

                  <h3>Integração com Armazenamento (Google Drive, OneDrive)</h3>
                  <p>Use n8n para:</p>
                  <ul>
                    <li>Sincronizar documentos entre o EVJI e os serviços de armazenamento</li>
                    <li>Organizar arquivos em pastas por caso e tipo</li>
                    <li>Extrair metadados de documentos para análise pelos agentes de IA</li>
                    <li>Criar backups automáticos de documentos importantes</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default IntegrationsPage;
