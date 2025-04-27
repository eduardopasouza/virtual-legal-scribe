
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/components/notification/NotificationSystem';
import { AgentResult } from '@/types/agent';

export function useAgentNotifications() {
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const notifyResult = (agentName: string, result: AgentResult) => {
    toast({
      title: result.success ? "Processamento concluído" : "Erro no processamento",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });

    addNotification(
      result.success ? 'success' : 'alert',
      agentName,
      result.message,
      'case'
    );
  };

  const notifyError = (errorMessage: string) => {
    toast({
      title: "Erro no processamento",
      description: errorMessage,
      variant: "destructive",
    });
    
    addNotification('alert', 'Erro no Processamento', errorMessage, 'system');
  };

  return {
    notifyResult,
    notifyError
  };
}
