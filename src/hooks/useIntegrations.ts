
import { useState, useEffect } from 'react';
import { IntegrationConfig, N8nWorkflow, APIConnection } from '@/types/integrations';
import { toast } from 'sonner';

export function useIntegrations() {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>([]);
  const [workflows, setWorkflows] = useState<N8nWorkflow[]>([]);
  const [connections, setConnections] = useState<APIConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load integrations from localStorage or API
  useEffect(() => {
    const loadIntegrations = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from an API
        const savedIntegrations = localStorage.getItem('evji_integrations');
        if (savedIntegrations) {
          setIntegrations(JSON.parse(savedIntegrations));
        } else {
          // Default integrations
          setIntegrations([
            {
              id: 'n8n',
              name: 'n8n Workflow Engine',
              enabled: false,
              provider: 'n8n',
              type: 'workflow',
              connected: false,
              status: 'disconnected'
            },
            {
              id: 'gmail',
              name: 'Gmail',
              enabled: false,
              provider: 'google',
              type: 'email',
              connected: false,
              status: 'disconnected'
            },
            {
              id: 'gcalendar',
              name: 'Google Calendar',
              enabled: false,
              provider: 'google',
              type: 'calendar',
              connected: false,
              status: 'disconnected'
            },
            {
              id: 'gdrive',
              name: 'Google Drive',
              enabled: false,
              provider: 'google',
              type: 'storage',
              connected: false,
              status: 'disconnected'
            },
            {
              id: 'onedrive',
              name: 'OneDrive',
              enabled: false,
              provider: 'microsoft',
              type: 'storage',
              connected: false,
              status: 'disconnected'
            },
            {
              id: 'gpt4o',
              name: 'GPT-4o',
              enabled: false,
              provider: 'openai',
              type: 'ai',
              connected: false,
              status: 'disconnected'
            }
          ]);
        }

        // Mock workflows
        setWorkflows([
          {
            id: 'workflow1',
            name: 'Email Processing',
            description: 'Processes incoming emails and extracts relevant data',
            webhookUrl: 'https://n8n.example.com/webhook/email-processing',
            active: false,
            triggerType: 'webhook'
          },
          {
            id: 'workflow2',
            name: 'Calendar Sync',
            description: 'Synchronizes events between EVJI and Google Calendar',
            webhookUrl: 'https://n8n.example.com/webhook/calendar-sync',
            active: false,
            triggerType: 'scheduler'
          },
          {
            id: 'workflow3',
            name: 'Document Processing',
            description: 'Processes uploaded documents and extracts metadata',
            webhookUrl: 'https://n8n.example.com/webhook/document-processing',
            active: false,
            triggerType: 'webhook'
          }
        ]);
      } catch (err: any) {
        setError(err.message);
        console.error('Error loading integrations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadIntegrations();
  }, []);

  // Save integrations to localStorage
  useEffect(() => {
    if (integrations.length > 0) {
      localStorage.setItem('evji_integrations', JSON.stringify(integrations));
    }
  }, [integrations]);

  const connectIntegration = async (id: string, config: Partial<IntegrationConfig>) => {
    try {
      // In a real implementation, this would make an API call to connect to the service
      setIntegrations(prev => prev.map(integration => 
        integration.id === id 
          ? { 
              ...integration, 
              ...config, 
              connected: true, 
              status: 'connected', 
              lastSynced: new Date() 
            } 
          : integration
      ));
      
      toast.success(`Conectado com sucesso a ${id}`);
      return true;
    } catch (err: any) {
      console.error(`Error connecting to ${id}:`, err);
      toast.error(`Erro ao conectar com ${id}: ${err.message}`);
      return false;
    }
  };

  const disconnectIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            connected: false, 
            status: 'disconnected',
            apiKey: undefined,
            webhookUrl: undefined,
            configUrl: undefined
          } 
        : integration
    ));
    toast.info(`Desconectado de ${id}`);
  };

  const updateWorkflow = (id: string, data: Partial<N8nWorkflow>) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === id ? { ...workflow, ...data } : workflow
    ));
  };

  const testConnection = async (id: string): Promise<boolean> => {
    const integration = integrations.find(i => i.id === id);
    if (!integration) return false;
    
    // In a real implementation, this would make an API call to test the connection
    // For now, we'll simulate a successful connection
    toast.info(`Testando conexão com ${integration.name}...`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.2; // 80% chance of success
        if (success) {
          toast.success(`Conexão com ${integration.name} estabelecida com sucesso`);
        } else {
          toast.error(`Falha ao conectar com ${integration.name}`);
        }
        resolve(success);
      }, 1500);
    });
  };

  return {
    integrations,
    workflows,
    connections,
    isLoading,
    error,
    connectIntegration,
    disconnectIntegration,
    updateWorkflow,
    testConnection
  };
}
