
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, File, X, Loader2, AlertCircle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDocuments } from "@/hooks/useDocuments";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DocumentUploaderProps {
  caseId?: string;
  onSuccess?: (selectedFiles: File[]) => void;
}

export function DocumentUploader({ caseId, onSuccess }: DocumentUploaderProps) {
  const { toast } = useToast();
  const { uploadDocument, isUploading } = useDocuments(caseId);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("petition");
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Reset status after 3 seconds of success or error
  useEffect(() => {
    if (uploadStatus === 'success' || uploadStatus === 'error') {
      const timer = setTimeout(() => {
        setUploadStatus('idle');
        setErrorMessage(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };
  
  const handleFileSelection = (file: File) => {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      setSelectedFile(file);
      setUploadStatus('idle');
    } else {
      toast({
        title: "Formato Inválido",
        description: "Por favor, envie apenas arquivos PDF.",
        variant: "destructive",
      });
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
        <CardDescription>
          Envie um documento jurídico para análise pelos agentes da EVJI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="document-type">Tipo de documento</Label>
            <Select 
              value={documentType} 
              onValueChange={setDocumentType}
            >
              <SelectTrigger id="document-type" className="mt-1">
                <SelectValue placeholder="Selecione o tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="petition">Petição</SelectItem>
                <SelectItem value="contract">Contrato</SelectItem>
                <SelectItem value="evidence">Evidência</SelectItem>
                <SelectItem value="decision">Decisão</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {uploadStatus === 'success' && (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle>Sucesso!</AlertTitle>
              <AlertDescription>
                O documento foi enviado com sucesso.
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro no Upload</AlertTitle>
              <AlertDescription>
                {errorMessage || "Ocorreu um erro ao enviar o documento."}
              </AlertDescription>
            </Alert>
          )}
          
          <div 
            className={`border-2 border-dashed rounded-md p-6 text-center mt-4 transition-all duration-200
              ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
              ${selectedFile ? 'bg-secondary/50' : ''}
              ${uploadStatus === 'loading' ? 'opacity-50' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!selectedFile ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <UploadCloud className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Arraste e solte seu PDF aqui, ou
                  </p>
                  <Label 
                    htmlFor="file-upload" 
                    className="relative cursor-pointer text-sm text-primary hover:text-primary/80"
                  >
                    <span>selecione um arquivo</span>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".pdf"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Apenas arquivos PDF são aceitos.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <File className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-medium truncate max-w-[200px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={clearSelectedFile}
                  disabled={uploadStatus === 'loading'}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" onClick={clearSelectedFile} disabled={uploadStatus === 'loading' || !selectedFile}>
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedFile || uploadStatus === 'loading'}
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
