
export interface IntegrationConfig {
  id: string;
  name: string;
  enabled: boolean;
  provider: 'n8n' | 'google' | 'microsoft' | 'openai';
  type: 'workflow' | 'email' | 'calendar' | 'storage' | 'ai';
  configUrl?: string;
  webhookUrl?: string;
  apiKey?: string;
  connected: boolean;
  lastSynced?: Date;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  errorMessage?: string;
}

export interface N8nWorkflow {
  id: string;
  name: string;
  description?: string;
  webhookUrl: string;
  active: boolean;
  lastExecuted?: Date;
  associatedAgent?: string;
  triggerType: 'webhook' | 'scheduler' | 'manual';
}

export interface APIConnection {
  provider: string;
  service: string;
  status: 'connected' | 'disconnected' | 'error';
  lastConnected?: Date;
  permissions: string[];
}

export interface IntegrationStats {
  executionsCount: number;
  successRate: number;
  averageExecutionTime: number;
  lastExecution?: Date;
}
