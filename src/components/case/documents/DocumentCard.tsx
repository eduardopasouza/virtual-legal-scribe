
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentMetadata } from '@/hooks/useDocuments';
import { formatFileSize, formatDate } from '@/lib/utils';
import { DocumentPreview } from '@/components/DocumentPreview';
import { 
  Download, 
  Loader2, 
  Trash2, 
  Tag, 
  FileText, 
  FileImage,
  FileArchive,
  File,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface DocumentCardProps {
  doc: DocumentMetadata;
  isLoading?: boolean;
  isProcessing?: boolean;
  onDownload: (doc: DocumentMetadata) => void;
  onDelete: (doc: DocumentMetadata) => void;
  onProcess?: (doc: DocumentMetadata) => void;
  onAddTag: (doc: DocumentMetadata, category: string) => void;
}

export function DocumentCard({ 
  doc, 
  isLoading, 
  isProcessing,
  onDownload, 
  onDelete, 
  onProcess,
  onAddTag 
}: DocumentCardProps) {
  const getFileIcon = () => {
    if (doc.type === 'application/pdf' || doc.name.endsWith('.pdf')) {
      return <FileText className="h-8 w-8 text-blue-500" />;
    }
    if (doc.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || doc.name.endsWith('.docx')) {
      return <FileText className="h-8 w-8 text-blue-700" />;
    }
    if (doc.type.startsWith('image/')) {
      return <FileImage className="h-8 w-8 text-green-500" />;
    }
    if (doc.type === 'application/zip' || doc.type === 'application/x-zip-compressed') {
      return <FileArchive className="h-8 w-8 text-amber-500" />;
    }
    return <File className="h-8 w-8 text-slate-500" />;
  };
  
  const getDocumentTypeLabel = (type?: string) => {
    if (!type) return 'Desconhecido';
    
    const types: {[key: string]: string} = {
      'petition': 'Petição',
      'contract': 'Contrato',
      'evidence': 'Evidência',
      'proceeding': 'Processo',
      'legal-research': 'Pesquisa',
      'court-decision': 'Decisão'
    };
    
    return types[type] || 'Outro';
  };
  
  const showProcessButton = onProcess && 
    (doc.processed_status === 'pending' || !doc.has_extracted_text) &&
    (doc.type === 'application/pdf' || 
     doc.name.endsWith('.pdf') || 
     doc.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
     doc.name.endsWith('.docx'));
  
  const getProcessingStatusBadge = () => {
    if (isProcessing) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processando...</Badge>;
    }
    if (doc.has_extracted_text) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Processado</Badge>;
    }
    if (doc.processed_status === 'failed') {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Falha no processamento</Badge>;
    }
    if (
      doc.type === 'application/pdf' || 
      doc.name.endsWith('.pdf') || 
      doc.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      doc.name.endsWith('.docx')
    ) {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Não processado</Badge>;
    }
    return null;
  };

  return (
    <Card className="p-4 hover:bg-accent/5 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          {getFileIcon()}
          <div>
            <p className="font-medium truncate max-w-[200px] md:max-w-[300px]">
              {doc.name}
            </p>
            <div className="flex flex-wrap gap-2 items-center text-xs text-muted-foreground mt-1">
              <span>{formatFileSize(doc.size)}</span>
              <span>•</span>
              {doc.uploaded_at && (
                <span>Enviado em {formatDate(new Date(doc.uploaded_at))}</span>
              )}
              {doc.document_type && (
                <>
                  <span>•</span>
                  <span>{getDocumentTypeLabel(doc.document_type)}</span>
                </>
              )}
              {getProcessingStatusBadge()}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-end md:self-center">
          {doc.file_path && doc.id && (
            <DocumentPreview 
              filePath={doc.file_path}
              fileName={doc.name}
              fileType={doc.type}
              fileId={doc.id}
            />
          )}
          
          {showProcessButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onProcess && onProcess(doc)}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Eye className="h-4 w-4 mr-1" />
              )}
              <span className="hidden sm:inline">
                {isProcessing ? 'Processando...' : 'Processar'}
              </span>
            </Button>
          )}
          
          <Button 
            variant="outline"
            size="sm"
            onClick={() => onDownload(doc)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Download className="h-4 w-4 mr-1" />
            )}
            <span className="hidden sm:inline">
              {isLoading ? 'Aguarde...' : 'Download'}
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">...</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Opções</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => onDownload(doc)}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download</span>
                </DropdownMenuItem>
                
                {doc.file_path && doc.id && (
                  <DropdownMenuItem onClick={() => {
                    const previewButton = document.querySelector(`[data-document-id="${doc.id}"] button[aria-label="Visualizar documento"]`);
                    if (previewButton instanceof HTMLButtonElement) {
                      previewButton.click();
                    }
                  }}>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>Visualizar</span>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                
                <DropdownMenuLabel>Categorizar como</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onAddTag(doc, 'petition')}>
                  <Tag className="mr-2 h-4 w-4" />
                  <span>Petição</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddTag(doc, 'contract')}>
                  <Tag className="mr-2 h-4 w-4" />
                  <span>Contrato</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddTag(doc, 'evidence')}>
                  <Tag className="mr-2 h-4 w-4" />
                  <span>Evidência</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddTag(doc, 'court-decision')}>
                  <Tag className="mr-2 h-4 w-4" />
                  <span>Decisão</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => onDelete(doc)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Excluir</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
