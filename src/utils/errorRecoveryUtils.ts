
/**
 * Error recovery utilities for handling agent failures
 */
import { toast } from "sonner";
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { AgentResult } from '@/types/agent';

// Type for recovery strategies
type RecoveryStrategy = 'retry' | 'fallback' | 'notify' | 'log';

// Interface for recovery options
interface RecoveryOptions {
  maxRetries?: number;
  retryDelay?: number;
  fallbackValue?: any;
  errorMessage?: string;
  notifyUser?: boolean;
}

// Default recovery options
const defaultRecoveryOptions: RecoveryOptions = {
  maxRetries: 2,
  retryDelay: 2000,
  notifyUser: true,
  errorMessage: "Ocorreu um erro. Tentando recuperar a operação."
};

/**
 * Execute a function with automatic recovery on failure
 */
export const executeWithRecovery = async <T>(
  fn: () => Promise<T>,
  strategies: RecoveryStrategy[] = ['retry', 'notify'],
  options: RecoveryOptions = {}
): Promise<T | null> => {
  // Merge options with defaults
  const mergedOptions = { ...defaultRecoveryOptions, ...options };
  let attempts = 0;
  
  const executeWithRetries = async (): Promise<T | null> => {
    try {
      return await fn();
    } catch (error: any) {
      attempts++;
      console.error(`Error on attempt ${attempts}:`, error);
      
      // Handle strategies in order
      for (const strategy of strategies) {
        switch(strategy) {
          case 'retry':
            if (attempts <= (mergedOptions.maxRetries || 0)) {
              console.log(`Retrying attempt ${attempts} of ${mergedOptions.maxRetries}`);
              if (mergedOptions.notifyUser) {
                toast.info("Tentando novamente", {
                  description: `Tentativa ${attempts} de ${mergedOptions.maxRetries}`
                });
              }
              
              // Wait before retry
              await new Promise(r => setTimeout(r, mergedOptions.retryDelay));
              return await executeWithRetries();
            }
            break;
            
          case 'fallback':
            if (mergedOptions.fallbackValue !== undefined) {
              console.log("Using fallback value:", mergedOptions.fallbackValue);
              return mergedOptions.fallbackValue as T;
            }
            break;
            
          case 'notify':
            if (mergedOptions.notifyUser) {
              toast.error("Ocorreu um erro", {
                description: error.message || mergedOptions.errorMessage
              });
            }
            break;
            
          case 'log':
            // Already logged above
            break;
        }
      }
      
      // If all strategies fail, return null
      return null;
    }
  };
  
  return executeWithRetries();
};

/**
 * Hook to handle agent errors with recovery
 */
export const useAgentErrorRecovery = () => {
  const { addNotification } = useNotificationSystem();
  
  const handleAgentError = async <T>(
    agentFn: () => Promise<AgentResult>,
    onSuccess?: (result: AgentResult) => void,
    options: RecoveryOptions = {}
  ): Promise<AgentResult | null> => {
    const result = await executeWithRecovery(
      agentFn,
      ['retry', 'notify', 'log'],
      options
    );
    
    if (result && result.success && onSuccess) {
      onSuccess(result);
    } else if (result && !result.success) {
      addNotification(
        'alert',
        'Falha no processamento de agente',
        result.message || 'O agente não conseguiu completar a operação.',
        'system'
      );
    }
    
    return result;
  };
  
  return {
    handleAgentError
  };
};
