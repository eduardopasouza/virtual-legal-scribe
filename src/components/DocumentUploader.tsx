
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFileUpload } from "@/hooks/useFileUpload";
import { DropZone } from './document/DropZone';
import { FilePreview } from './document/FilePreview';
import { UploadStatus } from './document/UploadStatus';
import { DocumentTypeSelect } from './document/DocumentTypeSelect';
import { DocumentActions } from './document/DocumentActions';
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface DocumentUploaderProps {
  caseId?: string;
  onSuccess?: (selectedFiles: File[], extractedContent?: string) => void;
  optional?: boolean;
  allowMultiple?: boolean;
}

export function DocumentUploader({ 
  caseId, 
  onSuccess, 
  optional = false, 
  allowMultiple = false 
}: DocumentUploaderProps) {
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
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo para enviar.",
        variant: "destructive",
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
          {(uploadStatus === 'success' || uploadStatus === 'error') && (
            <UploadStatus 
              status={uploadStatus} 
              errorMessage={errorMessage}
            />
          )}
          
          {uploadStatus === 'processing' && (
            <div className="space-y-2 py-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Processando documento...</span>
                <span className="text-sm font-medium">{processingProgress}%</span>
              </div>
              <Progress value={processingProgress} className="h-2" />
            </div>
          )}
          
          {selectedFile ? (
            <div className="space-y-4">
              <FilePreview
                file={selectedFile}
                onRemove={clearSelectedFile}
                disabled={uploadStatus === 'loading' || uploadStatus === 'processing'}
                extractedContent={extractedText}
              />
              
              <DocumentTypeSelect 
                value={documentType}
                onChange={setDocumentType}
                disabled={uploadStatus === 'loading' || uploadStatus === 'processing'}
              />
            </div>
          ) : (
            <DropZone
              onFileSelect={handleFileSelection}
              disabled={uploadStatus === 'loading' || uploadStatus === 'processing'}
            />
          )}
        </div>
      </CardContent>
      <DocumentActions 
        onCancel={clearSelectedFile}
        onSubmit={handleSubmit}
        isSubmitting={uploadStatus === 'loading' || uploadStatus === 'processing'}
        disabled={uploadStatus === 'loading' || uploadStatus === 'processing' || !selectedFile}
        uploadStatus={uploadStatus}
      />
    </Card>
  );
}
