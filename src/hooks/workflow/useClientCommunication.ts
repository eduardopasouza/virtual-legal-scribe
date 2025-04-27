
import { useState } from 'react';
import { ClientCommunication, FeedbackItem } from '@/agents/comunicador/types';
import { useGenerateCommunication } from './communication/useGenerateCommunication';
import { useFeedbackRecording } from './communication/useFeedbackRecording';
import { useUpdateCheck } from './communication/useUpdateCheck';
import { useAgentSimulation } from '@/hooks/agent/useAgentSimulation';

export function useClientCommunication(caseId?: string) {
  const [communication, setCommunication] = useState<ClientCommunication | null>(null);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const { isProcessing } = useAgentSimulation(caseId);
  
  const generateCommunication = useGenerateCommunication(caseId);
  const recordFeedback = useFeedbackRecording(caseId);
  const checkForUpdates = useUpdateCheck(caseId);

  // Update state when communication is generated
  if (generateCommunication.data && !communication) {
    setCommunication(generateCommunication.data);
  }

  // Update feedback state when new feedback is recorded
  if (recordFeedback.data) {
    setFeedback(prev => [...prev, recordFeedback.data]);
  }

  return {
    communication,
    feedback,
    isGenerating: isProcessing.comunicador || generateCommunication.isPending,
    isRecordingFeedback: recordFeedback.isPending,
    isCheckingForUpdates: checkForUpdates.isPending,
    generateCommunication,
    recordFeedback,
    checkForUpdates
  };
}
