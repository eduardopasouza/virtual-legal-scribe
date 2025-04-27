
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { IntegrationConfig } from '@/types/integrations';
import { Loader2, Check, X, AlertCircle, Settings } from 'lucide-react';

interface IntegrationCardProps {
  integration: IntegrationConfig;
  onConnect: (id: string, config: Partial<IntegrationConfig>) => Promise<boolean>;
  onDisconnect: (id: string) => void;
  onTest: (id: string) => Promise<boolean>;
  onConfigure?: (id: string) => void;
}

export function IntegrationCard({
  integration,
  onConnect,
  onDisconnect,
  onTest,
  onConfigure
}: IntegrationCardProps) {
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isTesting, setIsTesting] = React.useState(false);
  const [configValue, setConfigValue] = React.useState(
    integration.webhookUrl || integration.apiKey || ''
  );

  const handleConnect = async () => {
    setIsConnecting(true);
    const config: Partial<IntegrationConfig> = {};
    
    if (integration.provider === 'n8n') {
      config.webhookUrl = configValue;
    } else {
      config.apiKey = configValue;
    }
    
    await onConnect(integration.id, config);
    setIsConnecting(false);
  };

  const handleTest = async () => {
    setIsTesting(true);
    await onTest(integration.id);
    setIsTesting(false);
  };

  const getStatusIcon = () => {
    switch (integration.status) {
      case 'connected':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <X className="h-4 w-4 text-gray-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getConfigFieldLabel = () => {
    switch (integration.provider) {
      case 'n8n':
        return 'URL do Webhook';
      case 'openai':
        return 'API Key';
      case 'google':
        return 'Cliente ID OAuth';
      case 'microsoft':
        return 'Cliente ID OAuth';
      default:
        return 'Configuração';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">{integration.name}</CardTitle>
          <Badge 
            variant={
              integration.status === 'connected' ? 'default' : 
              integration.status === 'error' ? 'destructive' : 'outline'
            }
            className="flex items-center gap-1"
          >
            {getStatusIcon()}
            <span>
              {integration.status === 'connected' ? 'Conectado' : 
               integration.status === 'disconnected' ? 'Desconectado' : 
               integration.status === 'error' ? 'Erro' : 'Pendente'}
            </span>
          </Badge>
        </div>
        <CardDescription>
          {integration.provider === 'n8n' && 'Motor de fluxos de trabalho para automação'}
          {integration.provider === 'google' && integration.type === 'email' && 'Integração com serviço de email'}
          {integration.provider === 'google' && integration.type === 'calendar' && 'Integração com calendário'}
          {integration.provider === 'google' && integration.type === 'storage' && 'Integração com armazenamento de arquivos'}
          {integration.provider === 'microsoft' && 'Integração com armazenamento Microsoft'}
          {integration.provider === 'openai' && 'Integração com serviço de IA'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor={`config-${integration.id}`} className="text-sm font-medium">
              {getConfigFieldLabel()}
            </label>
            <input
              id={`config-${integration.id}`}
              type={integration.provider === 'openai' ? 'password' : 'text'}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={
                integration.provider === 'n8n' ? 'https://n8n.seu-dominio.com/webhook/xxxx' :
                integration.provider === 'openai' ? 'sk-...' : 
                'Cliente ID'
              }
              value={configValue}
              onChange={(e) => setConfigValue(e.target.value)}
              disabled={integration.connected}
            />
          </div>

          {integration.errorMessage && (
            <div className="text-sm text-red-500 mt-1">
              Erro: {integration.errorMessage}
            </div>
          )}

          {integration.lastSynced && (
            <div className="text-xs text-muted-foreground">
              Última sincronização: {new Date(integration.lastSynced).toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            id={`enable-${integration.id}`}
            checked={integration.enabled}
            disabled={!integration.connected}
          />
          <label htmlFor={`enable-${integration.id}`} className="text-sm font-medium">
            {integration.enabled ? 'Ativado' : 'Desativado'}
          </label>
        </div>

        <div className="flex space-x-2">
          {integration.connected ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDisconnect(integration.id)}
              >
                Desconectar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleTest} 
                disabled={isTesting}
              >
                {isTesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testando...
                  </>
                ) : (
                  'Testar'
                )}
              </Button>
              {onConfigure && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onConfigure(integration.id)}
                >
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Configurar</span>
                </Button>
              )}
            </>
          ) : (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleConnect} 
              disabled={isConnecting || !configValue}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Conectando...
                </>
              ) : (
                'Conectar'
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
