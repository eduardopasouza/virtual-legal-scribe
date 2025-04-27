
import { useState } from 'react';
import { useFileProcessing } from "@/hooks/useFileProcessing";
import { toast } from 'sonner';

interface UseUploadStateProps {
  onSuccess?: (selectedFiles: File[], extractedContent?: string) => void;
  caseId?: string;
}

export function useUploadState({ onSuccess, caseId }: UseUploadStateProps) {
  const {
    selectedFile,
    documentType,
    uploadStatus,
    errorMessage,
    processingProgress,
    extractedText,
    setDocumentType,
    setUploadStatus,
    setErrorMessage,
    handleFileSelection,
    processDocument,
    clearSelectedFile
  } = useFileProcessing({ onSuccess, caseId });

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast("Nenhum arquivo selecionado", {
        description: "Por favor, selecione um arquivo para enviar.",
      });
      return;
    }
    
    setUploadStatus('loading');
    
    try {
      let documentText = '';
      
      try {
        documentText = await processDocument(selectedFile);
      } catch (error: any) {
        console.warn("Text extraction failed, continuing with upload:", error.message);
      }
      
      const metadata = {
        documentType,
        hasExtractedText: Boolean(documentText),
      };
      
      if (onSuccess) {
        onSuccess([selectedFile], documentText);
      }
      
      setUploadStatus('success');
      clearSelectedFile();
      
    } catch (error: any) {
      setUploadStatus('error');
      setErrorMessage(error.message || "Falha no upload do documento");
    }
  };

  return {
    selectedFile,
    documentType,
    uploadStatus,
    errorMessage,
    processingProgress,
    extractedText,
    setDocumentType,
    handleFileSelection,
    handleSubmit,
    clearSelectedFile
  };
}
