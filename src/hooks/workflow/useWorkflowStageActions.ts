
import { useState } from 'react';
import { workflowService } from '@/workflow';
import { useWorkflowStrategy } from './useWorkflowStrategy';
import { useFactsAnalysis } from './useFactsAnalysis';
import { useAdvancedLayersAnalysis } from './useAdvancedLayersAnalysis';
import { useDocumentDrafting } from './useDocumentDrafting';
import { useDocumentVerification } from './useDocumentVerification';
import { useDocumentRevision } from './useDocumentRevision';
import { useClientCommunication } from './useClientCommunication';
import { WorkflowStageName } from '@/workflow/types';

export function useWorkflowStageActions(caseId?: string) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { 
    executeInitialStrategy, 
    executeIntermediateStrategy, 
    executeFinalStrategy,
    isProcessingStrategy 
  } = useWorkflowStrategy(caseId);

  const {
    executeFactsAnalysis,
    isAnalyzing: isAnalyzingFacts
  } = useFactsAnalysis(caseId);

  const {
    executeAdvancedAnalysis,
    isAnalyzing: isAnalyzingAdvanced
  } = useAdvancedLayersAnalysis(caseId);

  const {
    draftDocument,
    isDrafting
  } = useDocumentDrafting(caseId);

  const {
    verifyDocument,
    isVerifying
  } = useDocumentVerification(caseId);

  const {
    reviseDocument,
    isRevising
  } = useDocumentRevision(caseId);

  const {
    generateCommunication,
    isGenerating: isGeneratingCommunication
  } = useClientCommunication(caseId);

  const executeCurrentStrategicPhase = async (stageName: WorkflowStageName) => {
    const phase = getStrategicPhase(stageName);
    if (!phase) return null;
    
    switch (phase) {
      case 'initial':
        return await executeInitialStrategy.mutateAsync();
      case 'intermediate':
        return await executeIntermediateStrategy.mutateAsync({});
      case 'final':
        return await executeFinalStrategy.mutateAsync('');
      default:
        return null;
    }
  };
  
  const getStrategicPhase = (stageName?: WorkflowStageName): 'initial' | 'intermediate' | 'final' | null => {
    if (!stageName) return null;
    
    switch (stageName) {
      case 'planning':
        return 'initial';
      case 'strategy-review':
        return 'intermediate';
      case 'strategic-validation':
        return 'final';
      default:
        return null;
    }
  };

  return {
    isProcessing: isProcessing || isProcessingStrategy || isAnalyzingFacts || 
                  isAnalyzingAdvanced || isDrafting || isVerifying || isRevising || 
                  isGeneratingCommunication,
    executeCurrentStrategicPhase,
    executeInitialStrategy,
    executeIntermediateStrategy,
    executeFinalStrategy,
    executeFactsAnalysis,
    executeAdvancedAnalysis,
    draftDocument,
    verifyDocument,
    reviseDocument,
    generateCommunication,
  };
}
