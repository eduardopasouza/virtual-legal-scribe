
import React from 'react';
import { FileText, FileArchive, FolderOpen, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DocumentMetadata } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { DocumentPreview } from '@/components/DocumentPreview';

interface DocumentListProps {
  documents: DocumentMetadata[];
  loadingFiles: { [key: string]: boolean };
  onDownload: (doc: DocumentMetadata) => void;
  onDelete: (doc: DocumentMetadata) => void;
  onAddTag: (doc: DocumentMetadata, category: string) => void;
  refreshing?: boolean;
}

export function DocumentList({
  documents,
  loadingFiles,
  onDownload,
  onDelete,
  onAddTag,
  refreshing
}: DocumentListProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  if (refreshing) {
    return (
      <div className="text-center p-6">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        <p className="mt-2 text-muted-foreground">Carregando documentos...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        Nenhum documento encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{doc.name}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>
                  {formatFileSize(doc.size)} • {
                    doc.uploaded_at 
                      ? format(new Date(doc.uploaded_at), 'dd/MM/yyyy', { locale: ptBR })
                      : 'Data desconhecida'
                  }
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {doc.file_path && (
              <DocumentPreview 
                filePath={doc.file_path} 
                fileName={doc.name} 
                fileType={doc.type} 
                fileId={doc.id || ''} 
              />
            )}
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDownload(doc)}
              disabled={loadingFiles[doc.id!]}
            >
              {loadingFiles[doc.id!] ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileArchive className="h-4 w-4 mr-1" />
              )}
              <span className="hidden sm:inline">Baixar</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onAddTag(doc, 'Petição')}
            >
              <FolderOpen className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Tags</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(doc)}
            >
              <FileText className="h-4 w-4 text-destructive mr-1" />
              <span className="hidden sm:inline">Excluir</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
