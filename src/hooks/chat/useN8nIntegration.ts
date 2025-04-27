
import { useState } from 'react';
import { toast } from 'sonner';
import { Message } from '@/types/agent-chat';
import { useIntegrations } from '@/hooks/useIntegrations';

export function useN8nIntegration() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { integrations } = useIntegrations();
  
  const n8nIntegration = integrations.find(i => i.id === 'n8n');
  const isConfigured = n8nIntegration?.connected && n8nIntegration?.webhookUrl;
  
  // Send message to n8n for processing
  const processWithN8n = async (message: Message, workflowType: string): Promise<any> => {
    if (!isConfigured) {
      console.error("n8n integration not configured");
      return null;
    }
    
    setIsProcessing(true);
    
    try {
      // In a real implementation, we would call the n8n webhook here
      // This is a simulated call for demonstration purposes
      console.log(`Processing message with n8n (${workflowType}):`, message);
      
      // Simulate a call to n8n webhook
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate a response
      const response = {
        success: true,
        processedBy: `n8n-${workflowType}`,
        result: `Processed by n8n ${workflowType} workflow`,
        timestamp: new Date().toISOString()
      };
      
      return response;
    } catch (error: any) {
      console.error("Error processing with n8n:", error);
      toast.error(`Erro ao processar com n8n: ${error.message}`);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Process email with n8n
  const processEmail = async (message: Message) => {
    return processWithN8n(message, 'email');
  };
  
  // Process calendar event with n8n
  const processCalendarEvent = async (message: Message) => {
    return processWithN8n(message, 'calendar');
  };
  
  // Process document with n8n
  const processDocument = async (message: Message) => {
    return processWithN8n(message, 'document');
  };
  
  return {
    isConfigured,
    isProcessing,
    processEmail,
    processCalendarEvent,
    processDocument
  };
}
