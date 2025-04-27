
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useDocuments } from "@/hooks/useDocuments";
import { DropZone } from './document/DropZone';
import { FilePreview } from './document/FilePreview';
import { UploadStatus } from './document/UploadStatus';

interface DocumentUploaderProps {
  caseId?: string;
  onSuccess?: (selectedFiles: File[]) => void;
  optional?: boolean;
}

export function DocumentUploader({ caseId, onSuccess, optional = false }: DocumentUploaderProps) {
  const { toast } = useToast();
  const { uploadDocument, isUploading } = useDocuments(caseId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("petition");
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    if (uploadStatus === 'success' || uploadStatus === 'error') {
      const timer = setTimeout(() => {
        setUploadStatus('idle');
        setErrorMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    setUploadStatus('idle');
  };
  
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
      const metadata = await uploadDocument(selectedFile);
      
      setUploadStatus('success');
      setSelectedFile(null);
      setDocumentType("petition");
      
      if (onSuccess && metadata) {
        onSuccess([selectedFile]);
      }
    } catch (error: any) {
      setUploadStatus('error');
      setErrorMessage(error.message || "Falha no upload do documento");
    }
  };
  
  const clearSelectedFile = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setErrorMessage(null);
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
          
          {selectedFile ? (
            <FilePreview
              file={selectedFile}
              onRemove={clearSelectedFile}
              disabled={uploadStatus === 'loading'}
            />
          ) : (
            <DropZone
              onFileSelect={handleFileSelection}
              disabled={uploadStatus === 'loading'}
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button 
          variant="outline" 
          onClick={clearSelectedFile} 
          disabled={uploadStatus === 'loading' || !selectedFile}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={uploadStatus === 'loading'}
        >
          {uploadStatus === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>Enviar para Análise</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
