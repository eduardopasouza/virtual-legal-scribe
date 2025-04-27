
import React from 'react';
import { Loader2 } from 'lucide-react';
import { DocumentMetadata } from '@/hooks/useDocuments';
import { DocumentCard } from './DocumentCard';

interface DocumentListProps {
  documents: DocumentMetadata[];
  loadingFiles: { [key: string]: boolean };
  processingFiles?: { [key: string]: boolean };
  onDownload: (doc: DocumentMetadata) => void;
  onDelete: (doc: DocumentMetadata) => void;
  onProcess?: (doc: DocumentMetadata) => void;
  onAddTag: (doc: DocumentMetadata, category: string) => void;
  refreshing?: boolean;
}

export function DocumentList({
  documents,
  loadingFiles,
  processingFiles = {},
  onDownload,
  onDelete,
  onProcess,
  onAddTag,
  refreshing
}: DocumentListProps) {
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
        <DocumentCard
          key={doc.id}
          doc={doc}
          isLoading={loadingFiles[doc.id!]}
          isProcessing={processingFiles[doc.id!]}
          onDownload={onDownload}
          onDelete={onDelete}
          onProcess={onProcess}
          onAddTag={onAddTag}
        />
      ))}
    </div>
  );
}
