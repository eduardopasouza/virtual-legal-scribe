
import { supabase } from '@/integrations/supabase/client';
import { WorkflowAlert } from '../types';
import { workflowContextService } from './workflow-context.service';

export class WorkflowAlertService {
  async createAlert(caseId: string, alert: WorkflowAlert) {
    const { data, error } = await supabase
      .from('alerts')
      .insert({
        case_id: caseId,
        title: alert.title,
        description: alert.description || '',
        type: alert.type,
        priority: alert.severity,
        status: 'pending'
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // Add to context
    const context = workflowContextService.getContext(caseId);
    if (context) {
      context.alerts.push(alert);
      workflowContextService.updateContext(caseId, context);
    }
    
    return data;
  }
}

export const workflowAlertService = new WorkflowAlertService();
