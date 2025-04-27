
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useDocuments, DocumentMetadata } from '@/hooks/useDocuments';
import { useToast } from '@/hooks/use-toast';

export function useDocumentManager(caseId?: string) {
  const [loadingFiles, setLoadingFiles] = useState<{ [key: string]: boolean }>({});
  const [processingFiles, setProcessingFiles] = useState<{ [key: string]: boolean }>({});
  const [refreshing, setRefreshing] = useState(false);
  
  const { listDocuments, getDocumentUrl, deleteDocument, processDocument } = useDocuments(caseId);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const fetchDocuments = async () => {
    if (caseId) {
      setRefreshing(true);
      try {
        const docs = await listDocuments(caseId);
        return docs;
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Erro ao carregar documentos",
          description: "Não foi possível carregar os documentos do caso.",
          variant: "destructive"
        });
        return [];
      } finally {
        setRefreshing(false);
      }
    }
    return [];
  };

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
        
        // Refresh document list
        await fetchDocuments();
        
        return result.text;
      }
      
      if (result.error) {
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

  const handleUploadSuccess = (files: File[], extractedContent?: string) => {
    fetchDocuments();
    if (caseId) {
      queryClient.invalidateQueries({ queryKey: ["documents", caseId] });
    }
  };

  return {
    loadingFiles,
    processingFiles,
    refreshing,
    fetchDocuments,
    handleDownload,
    handleProcessDocument,
    handleUploadSuccess,
  };
}
