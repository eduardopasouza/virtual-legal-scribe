
import { supabase } from '@/integrations/supabase/client';
import { WorkflowStageName, WorkflowVerificationResult } from '../types';
import { workflowConfigService } from './workflow-config.service';
import { workflowContextService } from './workflow-context.service';

export class WorkflowStageValidatorService {
  async verifyStageCompleteness(caseId: string, stageName: WorkflowStageName): Promise<WorkflowVerificationResult> {
    const stageConfig = workflowConfigService.getStageConfig(stageName);
    if (!stageConfig) {
      return {
        complete: false,
        missingItems: ['Configuração de etapa não encontrada']
      };
    }
    
    const missingItems: string[] = [];
    
    if (stageConfig.requiredDocuments && stageConfig.requiredDocuments.length > 0) {
      const { data: documents } = await supabase
        .from('documents')
        .select('type, name')
        .eq('case_id', caseId);
      
      const documentTypes = documents?.map(doc => doc.type) || [];
      const missingDocs = stageConfig.requiredDocuments.filter(
        docType => !documentTypes.includes(docType)
      );
      
      if (missingDocs.length > 0) {
        missingItems.push(`Documentos necessários: ${missingDocs.join(', ')}`);
      }
    }
    
    if (stageConfig.completionCriteria && stageConfig.completionCriteria.length > 0) {
      workflowContextService.logProgress(caseId, `Checking completion criteria for ${stageName}`);
    }
    
    const context = workflowContextService.getContext(caseId);
    if (context && !context.stageResults[stageName]) {
      missingItems.push('Resultados da etapa não registrados');
    }
    
    return {
      complete: missingItems.length === 0,
      missingItems,
      recommendations: missingItems.length > 0 
        ? ['Resolva os itens faltantes antes de avançar'] 
        : undefined
    };
  }
}

export const workflowStageValidator = new WorkflowStageValidatorService();

