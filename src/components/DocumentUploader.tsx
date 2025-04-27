
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useDocuments } from "@/hooks/useDocuments";
import { DropZone } from './document/DropZone';
import { FilePreview } from './document/FilePreview';
import { UploadStatus } from './document/UploadStatus';
import { DocumentProcessingService } from '@/services/documentProcessing';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

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
  const { toast } = useToast();
  const { uploadDocument, isUploading } = useDocuments(caseId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("petition");
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error' | 'loading' | 'processing'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  
  // Document type options
  const documentTypes = [
    { value: 'petition', label: 'Petição' },
    { value: 'contract', label: 'Contrato' },
    { value: 'evidence', label: 'Evidência' },
    { value: 'proceeding', label: 'Processo' },
    { value: 'legal-research', label: 'Pesquisa Jurídica' }
  ];
  
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
    // Check file size (limit to 10MB)
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
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Extract text from document
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
      // First process the document to extract text
      let documentText = '';
      
      try {
        documentText = await processDocument(selectedFile);
      } catch (error: any) {
        // If text extraction fails but file format is acceptable, continue with upload
        console.warn("Text extraction failed, continuing with upload:", error.message);
      }
      
      // Upload the document file
      const metadata = await uploadDocument(selectedFile, {
        documentType,
        hasExtractedText: Boolean(documentText),
      });
      
      setUploadStatus('success');
      
      if (onSuccess && metadata) {
        onSuccess([selectedFile], documentText);
      }
      
      // Reset form state
      setSelectedFile(null);
      setDocumentType("petition");
      setExtractedText(null);
      
    } catch (error: any) {
      setUploadStatus('error');
      setErrorMessage(error.message || "Falha no upload do documento");
    }
  };
  
  const clearSelectedFile = () => {
    setSelectedFile(null);
    setUploadStatus('idle');
    setErrorMessage(null);
    setExtractedText(null);
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
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="document-type">
                  Tipo de documento
                </label>
                <Select 
                  value={documentType} 
                  onValueChange={setDocumentType}
                  disabled={uploadStatus === 'loading' || uploadStatus === 'processing'}
                >
                  <SelectTrigger id="document-type" className="w-full">
                    <SelectValue placeholder="Selecione o tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <DropZone
              onFileSelect={handleFileSelection}
              disabled={uploadStatus === 'loading' || uploadStatus === 'processing'}
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button 
          variant="outline" 
          onClick={clearSelectedFile} 
          disabled={uploadStatus === 'loading' || uploadStatus === 'processing' || !selectedFile}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={uploadStatus === 'loading' || uploadStatus === 'processing' || !selectedFile}
        >
          {uploadStatus === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : uploadStatus === 'processing' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>Enviar para Análise</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
