
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useDocuments, DocumentMetadata } from '@/hooks/useDocuments';
import { useErrorHandler } from '@/utils/errorHandling';

export function useDocumentManager(caseId?: string) {
  const [loadingFiles, setLoadingFiles] = useState<{ [key: string]: boolean }>({});
  const [processingFiles, setProcessingFiles] = useState<{ [key: string]: boolean }>({});
  const [refreshing, setRefreshing] = useState(false);
  
  const { listDocuments, getDocumentUrl, deleteDocument, processDocument } = useDocuments(caseId);
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();
  
  const fetchDocuments = async () => {
    if (caseId) {
      setRefreshing(true);
      try {
        const docs = await listDocuments(caseId);
        return docs;
      } catch (error) {
        handleError(error, "Não foi possível carregar os documentos do caso.", {
          context: "Gerenciamento de Documentos"
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
      } else {
        throw new Error("URL do documento não gerada");
      }
    } catch (error) {
      handleError(error, "Não foi possível gerar o link para download", {
        context: "Download de Documento"
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
        // Sucesso ao processar o documento
        return result.text;
      }
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      return null;
    } catch (error) {
      handleError(error, "Não foi possível extrair o conteúdo do documento", {
        context: "Processamento de Documento",
        severity: "medium"
      });
      return null;
    } finally {
      setProcessingFiles(prev => ({ ...prev, [doc.id!]: false }));
    }
  };

  const handleDeleteDocument = async (doc: DocumentMetadata) => {
    if (!doc.id || !doc.file_path) return false;
    
    try {
      const success = await deleteDocument(doc.id, doc.file_path);
      
      if (success) {
        // Atualizar a lista de documentos
        queryClient.invalidateQueries({ queryKey: ["documents", caseId] });
      }
      
      return success;
    } catch (error) {
      handleError(error, "Não foi possível excluir o documento", {
        context: "Exclusão de Documento"
      });
      return false;
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
    handleDeleteDocument,
    handleUploadSuccess,
  };
}
