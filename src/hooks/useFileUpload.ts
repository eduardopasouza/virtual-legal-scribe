
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { DocumentProcessingService } from '@/services/documentProcessing';

interface UseFileUploadProps {
  onSuccess?: (files: File[], extractedContent?: string) => void;
  caseId?: string;
}

export function useFileUpload({ onSuccess, caseId }: UseFileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("petition");
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error' | 'loading' | 'processing'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelection = (file: File) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Arquivo muito grande",
        description: "O tamanho máximo permitido é de 10MB.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
    setUploadStatus('idle');
    setExtractedText(null);
  };

  const processDocument = async (file: File) => {
    setUploadStatus('processing');
    setProcessingProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      const result = await DocumentProcessingService.extractText(file);
      
      clearInterval(progressInterval);
      setProcessingProgress(100);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setExtractedText(result.text);
      return result.text;
    } catch (error: any) {
      console.error('Error processing document:', error);
      toast({
        title: "Erro ao processar documento",
        description: error.message || "Não foi possível extrair o texto do documento.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setTimeout(() => {
        setProcessingProgress(0);
      }, 1000);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setErrorMessage(null);
    setExtractedText(null);
  };

  return {
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
  };
}
