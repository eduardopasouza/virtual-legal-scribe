
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { DocumentUploader } from '@/components/DocumentUploader';
import { DocumentMetadata } from '@/hooks/useDocuments';
import { useDocumentManager } from '@/hooks/useDocumentManager';
import { DocumentList } from './documents/DocumentList';
import { DocumentFilterSection } from './documents/DocumentFilterSection';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

const DOCUMENT_CATEGORIES = [
  { value: 'all', label: 'Todos' },
  { value: 'petition', label: 'Petições' },
  { value: 'contract', label: 'Contratos' },
  { value: 'evidence', label: 'Provas' },
  { value: 'proceeding', label: 'Processos' },
  { value: 'legal-research', label: 'Pesquisas' },
  { value: 'court-decision', label: 'Decisões' },
  { value: 'other', label: 'Outros' }
];

interface CaseDocumentsProps {
  caseId?: string;
  onDocumentProcessed?: (docId: string, content: string) => void;
}

export function CaseDocuments({ caseId, onDocumentProcessed }: CaseDocumentsProps) {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentMetadata[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentMetadata | null>(null);
  const { toast } = useToast();

  const {
    loadingFiles,
    processingFiles,
    refreshing,
    fetchDocuments,
    handleDownload,
    handleProcessDocument,
    handleUploadSuccess
  } = useDocumentManager(caseId);

  useEffect(() => {
    fetchDocuments().then(setDocuments);
  }, [caseId]);

  const handleDeleteClick = (doc: DocumentMetadata) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const handleAddTag = (doc: DocumentMetadata, category: string) => {
    toast({
      title: "Tag adicionada",
      description: `Documento categorizado como "${category}"`,
    });
  };

  const handleProcessSuccess = async (docId: string, content: string) => {
    if (onDocumentProcessed) {
      onDocumentProcessed(docId, content);
    }
    await fetchDocuments();
  };

  return (
    <div className="space-y-6">
      <DocumentUploader caseId={caseId} onSuccess={handleUploadSuccess} />
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Documentos do Caso</CardTitle>
              <CardDescription>
                Todos os documentos relacionados a este caso
              </CardDescription>
            </div>
            
            <DocumentFilterSection
              documents={documents}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onSearchChange={setSearchTerm}
              onCategoryChange={setSelectedCategory}
              onFilteredDocumentsChange={setFilteredDocuments}
              categories={DOCUMENT_CATEGORIES}
            />
          </div>
        </CardHeader>
        <CardContent>
          <DocumentList
            documents={filteredDocuments}
            loadingFiles={loadingFiles}
            processingFiles={processingFiles}
            onDownload={handleDownload}
            onDelete={handleDeleteClick}
            onProcess={handleProcessDocument}
            onAddTag={handleAddTag}
            refreshing={refreshing}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredDocuments.length} documento(s)
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchDocuments}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2" />
            )}
            Atualizar
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir documento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o documento "{documentToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={async () => {
                if (documentToDelete && documentToDelete.id && documentToDelete.file_path) {
                  await handleProcessDocument(documentToDelete);
                  setDeleteDialogOpen(false);
                  setDocumentToDelete(null);
                }
              }} 
              className="bg-destructive text-destructive-foreground"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
