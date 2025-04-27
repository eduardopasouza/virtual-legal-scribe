
import { toast } from "sonner";
import { useNotifications } from '@/components/notification/NotificationSystem';

type ErrorSeverity = 'low' | 'medium' | 'high';

interface ErrorHandlingOptions {
  showToast?: boolean;
  showNotification?: boolean;
  severity?: ErrorSeverity;
  context?: string;
}

const defaultOptions: ErrorHandlingOptions = {
  showToast: true,
  showNotification: true,
  severity: 'medium',
  context: 'Operação'
};

/**
 * Handles errors with user-friendly notifications
 */
export function handleError(error: any, message?: string, options?: ErrorHandlingOptions) {
  const opts = { ...defaultOptions, ...options };
  const errorMessage = message || error?.message || 'Ocorreu um erro inesperado';
  
  // Always log to console
  console.error(`[${opts.context}] Error:`, error);
  
  // Show toast notification if enabled
  if (opts.showToast) {
    toast.error(errorMessage, {
      description: opts.severity === 'high' ? 'Tente novamente ou contate o suporte.' : undefined,
      duration: opts.severity === 'high' ? 6000 : 4000,
    });
  }

  // Add to notification system if enabled
  if (opts.showNotification && typeof window !== 'undefined') {
    const addNotification = (window as any).addNotification;
    if (typeof addNotification === 'function') {
      addNotification(
        'alert',
        `Erro: ${opts.context}`,
        errorMessage,
        'system'
      );
    }
  }

  return errorMessage;
}

/**
 * React hook for error handling capabilities
 */
export function useErrorHandler() {
  const { addNotification } = useNotifications();
  
  const handleErrorWithNotification = (
    error: any, 
    message?: string,
    options?: ErrorHandlingOptions
  ) => {
    const opts = { ...defaultOptions, ...options };
    const errorMessage = message || error?.message || 'Ocorreu um erro inesperado';
    
    // Always log to console
    console.error(`[${opts.context}] Error:`, error);
    
    // Show toast notification if enabled
    if (opts.showToast) {
      toast.error(errorMessage, {
        description: opts.severity === 'high' ? 'Tente novamente ou contate o suporte.' : undefined,
        duration: opts.severity === 'high' ? 6000 : 4000,
      });
    }
    
    // Add to notification system
    if (opts.showNotification) {
      addNotification(
        'alert',
        `Erro: ${opts.context}`,
        errorMessage,
        'system'
      );
    }
    
    return errorMessage;
  };
  
  return {
    handleError: handleErrorWithNotification
  };
}
