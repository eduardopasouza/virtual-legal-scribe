
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadProgress } from './UploadProgress';
import { UploadForm } from './UploadForm';
import { toast } from 'sonner';
import { useFileUpload } from "@/hooks/useFileUpload";

interface UploadContainerProps {
  caseId?: string;
  onSuccess?: (selectedFiles: File[], extractedContent?: string) => void;
  optional?: boolean;
  allowMultiple?: boolean;
}

export function UploadContainer({ 
  caseId, 
  onSuccess, 
  optional = false, 
  allowMultiple = false 
}: UploadContainerProps) {
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
  } = useFileUpload({ onSuccess, caseId });

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload de Documento</CardTitle>
        <CardDescription className="space-y-2">
          {optional && (
            <p className="text-muted-foreground">
              Você pode pular esta etapa e anexar documentos mais tarde.
            </p>
          )}
          Envie um documento jurídico para análise pelos agentes da EVJI.
          <div className="text-xs text-muted-foreground mt-1">
            Formatos suportados: PDF, DOCX • Tamanho máximo: 10MB
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <UploadProgress 
            uploadStatus={uploadStatus}
            errorMessage={errorMessage}
            processingProgress={processingProgress}
          />
          <UploadForm
            selectedFile={selectedFile}
            documentType={documentType}
            uploadStatus={uploadStatus}
            extractedText={extractedText}
            onFileSelect={handleFileSelection}
            onTypeChange={setDocumentType}
            onRemoveFile={clearSelectedFile}
            onSubmit={handleSubmit}
          />
        </div>
      </CardContent>
    </Card>
  );
}
