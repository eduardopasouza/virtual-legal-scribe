
import { useState } from 'react';
import { workflowService } from '@/workflow';
import { useWorkflowStrategy } from './useWorkflowStrategy';
import { useFactsAnalysis } from './useFactsAnalysis';
import { useAdvancedLayersAnalysis } from './useAdvancedLayersAnalysis';
import { useDocumentDrafting } from './useDocumentDrafting';
import { useDocumentVerification } from './useDocumentVerification';
import { useDocumentRevision } from './useDocumentRevision';
import { useClientCommunication } from './useClientCommunication';

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

  const executeCurrentStrategicPhase = async (phase: 'initial' | 'intermediate' | 'final') => {
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
