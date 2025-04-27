
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, X, Download, FileText, ExternalLink, Eye } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface DocumentPreviewProps {
  filePath: string;
  fileName: string;
  fileType: string;
  fileId: string;
}

export function DocumentPreview({ filePath, fileName, fileType, fileId }: DocumentPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getDocumentUrl } = useDocuments();
  
  // Verifica se o tipo de arquivo é suportado para visualização
  const isPreviewable = () => {
    const previewableTypes = [
      'application/pdf',
      'image/jpeg', 
      'image/png', 
      'image/gif', 
      'image/webp',
      'text/plain',
      'text/html',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    ];
    
    return previewableTypes.includes(fileType);
  };
  
  const getPreviewUrl = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const url = await getDocumentUrl(filePath);
      setPreviewUrl(url);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar visualização');
      console.error('Erro ao carregar visualização:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Renderiza o conteúdo de visualização com base no tipo de arquivo
  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <p className="text-muted-foreground">Carregando visualização...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <p className="text-destructive mb-2">Erro ao carregar visualização</p>
          <p className="text-muted-foreground text-sm mb-4">{error}</p>
          <Button variant="outline" onClick={getPreviewUrl}>Tentar novamente</Button>
        </div>
      );
    }
    
    if (!previewUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-[400px]">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Clique para visualizar o documento</p>
          <Button onClick={getPreviewUrl}>Visualizar</Button>
        </div>
      );
    }
    
    if (fileType.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center h-[400px] overflow-hidden">
          <img 
            src={previewUrl} 
            alt={fileName} 
            className="max-w-full max-h-full object-contain" 
          />
        </div>
      );
    }
    
    // Para PDFs e outros tipos de documentos
    return (
      <iframe 
        src={previewUrl} 
        title={fileName}
        className="w-full h-[400px] border-0"
        sandbox="allow-scripts allow-same-origin"
      />
    );
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Visualizar</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{fileName}</DialogTitle>
          <DialogDescription>
            Visualização do documento
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {isPreviewable() ? (
            renderPreview()
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px]">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                Visualização não disponível para este tipo de arquivo
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {fileType}
              </p>
              <Button variant="outline" onClick={async () => {
                const url = await getDocumentUrl(filePath);
                if (url) window.open(url, '_blank');
              }}>
                <Download className="h-4 w-4 mr-2" />
                Baixar arquivo
              </Button>
            </div>
          )}
        </div>
        
        <CardFooter className="flex justify-between pt-4">
          <Button variant="outline" onClick={async () => {
            const url = await getDocumentUrl(filePath);
            if (url) window.open(url, '_blank');
          }}>
            <Download className="h-4 w-4 mr-2" />
            Baixar
          </Button>
          <Button variant="outline" onClick={async () => {
            const url = await getDocumentUrl(filePath);
            if (url) window.open(url, '_blank');
          }}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir em nova aba
          </Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
}
