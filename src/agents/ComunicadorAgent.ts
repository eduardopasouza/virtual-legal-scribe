
import { BaseAgent } from './base/BaseAgent';
import { AgentTask, AgentResult } from '@/types/agent';
import { ClientCommunicationService } from './comunicador/clientCommunicationService';
import { FeedbackItem } from './comunicador/types';
import { supabase } from '@/integrations/supabase/client';

export class ComunicadorAgent extends BaseAgent {
  private communicationService: ClientCommunicationService;
  
  constructor() {
    super(
      'comunicador',
      'Comunicador com Cliente',
      'Interface de feedback, gera apresentações e registra comunicações'
    );
    this.communicationService = new ClientCommunicationService();
  }
  
  async execute({ caseId, input, metadata }: AgentTask): Promise<AgentResult> {
    if (!caseId) {
      return {
        success: false,
        message: "ID do caso não fornecido"
      };
    }
    
    try {
      // Determine what action to take based on input
      const action = metadata?.action || 'generate-communication';
      
      switch (action) {
        case 'generate-communication':
          return await this.generateClientCommunication(caseId, metadata);
        
        case 'record-feedback':
          return await this.recordClientFeedback(caseId, input);
        
        case 'check-for-updates':
          return await this.checkIfUpdatesNeeded(caseId);
          
        default:
          return {
            success: false,
            message: `Ação desconhecida: ${action}`
          };
      }
    } catch (error: any) {
      console.error("ComunicadorAgent error:", error);
      return {
        success: false,
        message: `Erro ao processar comunicação com cliente: ${error.message}`
      };
    }
  }
  
  private async generateClientCommunication(caseId: string, metadata?: any): Promise<AgentResult> {
    // Get the latest document for this case
    const { data: documents } = await supabase
      .from('documents')
      .select('*')
      .eq('case_id', caseId)
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (!documents || documents.length === 0) {
      return {
        success: false,
        message: "Nenhum documento encontrado para este caso"
      };
    }
    
    // Get document content
    const documentContent = documents[0].content || '';
    
    // Generate communication package
    const communication = await this.communicationService.createClientCommunication(
      documentContent, 
      caseId
    );
    
    return {
      success: true,
      message: "Comunicação com cliente gerada com sucesso",
      details: {
        communication
      }
    };
  }
  
  private async recordClientFeedback(caseId: string, input: any): Promise<AgentResult> {
    if (!input || typeof input !== 'object') {
      return {
        success: false,
        message: "Feedback inválido"
      };
    }
    
    const feedback: FeedbackItem = {
      type: input.type || 'question',
      content: input.content || '',
      timestamp: new Date(),
      resolved: false,
      priority: input.priority || 'medium'
    };
    
    const success = await this.communicationService.recordFeedback(caseId, feedback);
    
    if (success) {
      // Log the feedback activity
      await supabase
        .from('activities')
        .insert({
          case_id: caseId,
          agent: 'comunicador',
          action: 'Registro de feedback',
          result: JSON.stringify(feedback)
        });
    }
    
    return {
      success,
      message: success 
        ? "Feedback registrado com sucesso" 
        : "Erro ao registrar feedback",
      details: {
        feedback
      }
    };
  }
  
  private async checkIfUpdatesNeeded(caseId: string): Promise<AgentResult> {
    const updatesNeeded = await this.communicationService.checkForRequiredUpdates(caseId);
    
    return {
      success: true,
      message: updatesNeeded
        ? "Existem correções pendentes que requerem atenção"
        : "Não há correções pendentes",
      details: {
        updatesNeeded,
        actionRequired: updatesNeeded ? 'review-and-update' : 'none'
      }
    };
  }
}
