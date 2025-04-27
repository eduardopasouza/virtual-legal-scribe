
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { DocumentUploader } from '@/components/DocumentUploader';
import { useDocuments, DocumentMetadata } from '@/hooks/useDocuments';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { DocumentList } from './documents/DocumentList';
import { DocumentFilters } from './documents/DocumentFilters';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, RefreshCcw } from 'lucide-react';
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
  const { listDocuments, getDocumentUrl, deleteDocument, processDocument } = useDocuments(caseId);
  const [loadingFiles, setLoadingFiles] = useState<{ [key: string]: boolean }>({});
  const [processingFiles, setProcessingFiles] = useState<{ [key: string]: boolean }>({});
  const [refreshing, setRefreshing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<DocumentMetadata | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchDocuments = async () => {
    if (caseId) {
      setRefreshing(true);
      try {
        const docs = await listDocuments(caseId);
        setDocuments(docs);
        setFilteredDocuments(docs);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Erro ao carregar documentos",
          description: "Não foi possível carregar os documentos do caso.",
          variant: "destructive"
        });
      } finally {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [caseId]);

  useEffect(() => {
    let results = documents;
    
    if (searchTerm) {
      results = results.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'petition') {
        results = results.filter(doc => doc.document_type === 'petition');
      } else if (selectedCategory === 'contract') {
        results = results.filter(doc => doc.document_type === 'contract');
      } else if (selectedCategory === 'evidence') {
        results = results.filter(doc => doc.document_type === 'evidence');
      } else if (selectedCategory === 'proceeding') {
        results = results.filter(doc => doc.document_type === 'proceeding');
      } else if (selectedCategory === 'legal-research') {
        results = results.filter(doc => doc.document_type === 'legal-research');
      } else if (selectedCategory === 'court-decision') {
        const courtExtensions = ['.pdf'];
        results = results.filter(doc => 
          doc.document_type === 'court-decision' || 
          courtExtensions.some(ext => doc.name.toLowerCase().endsWith(ext))
        );
      } else {
        // Filter by file extension for other categories
        const extensionMapping: {[key: string]: string[]} = {
          'petition': ['.pdf', '.docx'],
          'contract': ['.pdf', '.docx'],
          'evidence': ['.jpg', '.png', '.pdf', '.mp4'],
          'proceeding': ['.pdf'],
          'legal-research': ['.pdf', '.docx', '.txt'],
          'court-decision': ['.pdf'],
          'other': ['.xlsx', '.pptx', '.zip']
        };
        
        const extensions = extensionMapping[selectedCategory] || [];
        results = results.filter(doc => 
          extensions.some(ext => doc.name.toLowerCase().endsWith(ext))
        );
      }
    }
    
    setFilteredDocuments(results);
  }, [searchTerm, selectedCategory, documents]);

  const handleDownload = async (doc: DocumentMetadata) => {
    if (!doc.file_path) return;
    
    setLoadingFiles(prev => ({ ...prev, [doc.id!]: true }));
    
    try {
      const url = await getDocumentUrl(doc.file_path);
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error('Error getting signed URL:', error);
      toast({
        title: "Erro ao baixar documento",
        description: "Não foi possível gerar o link para download",
        variant: "destructive"
      });
    } finally {
      setLoadingFiles(prev => ({ ...prev, [doc.id!]: false }));
    }
  };

  const handleProcessDocument = async (doc: DocumentMetadata) => {
    if (!doc.id) return;
    
    setProcessingFiles(prev => ({ ...prev, [doc.id!]: true }));
    
    try {
      const result = await processDocument(doc.id);
      
      if (result.text) {
        toast({
          title: "Documento processado",
          description: `O conteúdo do documento foi extraído com sucesso (${result.text.length} caracteres)`
        });
        
        // Refresh document list to update status
        fetchDocuments();
        
        // Notify parent component if callback provided
        if (onDocumentProcessed) {
          onDocumentProcessed(doc.id, result.text);
        }
      } else if (result.error) {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('Error processing document:', error);
      toast({
        title: "Erro ao processar documento",
        description: error.message || "Não foi possível extrair o conteúdo do documento",
        variant: "destructive"
      });
    } finally {
      setProcessingFiles(prev => ({ ...prev, [doc.id!]: false }));
    }
  };

  const handleDeleteClick = (doc: DocumentMetadata) => {
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (documentToDelete && documentToDelete.id && documentToDelete.file_path) {
      const success = await deleteDocument(documentToDelete.id, documentToDelete.file_path);
      if (success) {
        fetchDocuments();
        if (caseId) {
          queryClient.invalidateQueries({ queryKey: ["documents", caseId] });
        }
      }
    }
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  const handleUploadSuccess = (files: File[], extractedContent?: string) => {
    fetchDocuments();
    if (caseId) {
      queryClient.invalidateQueries({ queryKey: ["documents", caseId] });
    }
    
    // If we have extracted content and a callback, notify parent component
    if (extractedContent && onDocumentProcessed) {
      // We don't have the document ID here since it was just created
      // In a real implementation, we might want to return the ID from the upload function
      // For now, we'll just use a placeholder
      onDocumentProcessed("latest", extractedContent);
    }
  };
  
  const handleAddTag = (doc: DocumentMetadata, category: string) => {
    toast({
      title: "Tag adicionada",
      description: `Documento categorizado como "${category}"`,
    });
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
            
            <DocumentFilters
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              onSearchChange={setSearchTerm}
              onCategoryChange={setSelectedCategory}
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
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
