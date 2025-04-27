
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAgent } from '@/agents';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface DocumentTypeOption {
  id: string;
  label: string;
}

const DOCUMENT_TYPES: DocumentTypeOption[] = [
  { id: 'peticao-inicial', label: 'Petição Inicial' },
  { id: 'contestacao', label: 'Contestação' },
  { id: 'recurso', label: 'Recurso' },
  { id: 'parecer', label: 'Parecer Jurídico' }
];

export function useDocumentDrafting(caseId?: string) {
  const queryClient = useQueryClient();
  const [isDrafting, setIsDrafting] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<string>('peticao-inicial');

  // Fetch existing drafted documents from the database
  const fetchDraftedDocuments = async () => {
    if (!caseId) return [];
    
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('case_id', caseId)
      .eq('agent', 'redator')
      .like('action', 'Redação de%')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data?.map(item => ({
      id: item.id,
      type: JSON.parse(item.result || '{}').type || 'unknown',
      title: item.action.replace('Redação de ', ''),
      content: JSON.parse(item.result || '{}').content || '',
      sections: JSON.parse(item.result || '{}').sections || [],
      createdAt: item.created_at
    })) || [];
  };

  // Query to get drafted documents
  const { 
    data: draftedDocuments, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['drafted-documents', caseId],
    queryFn: fetchDraftedDocuments,
    enabled: !!caseId
  });

  // Get the latest document draft
  const getLatestDocumentDraft = async () => {
    if (!caseId) return null;
    
    const { data, error } = await supabase
      .from('activities')
      .select('result')
      .eq('case_id', caseId)
      .eq('agent', 'redator')
      .like('action', 'Redação de%')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    
    return data?.result ? JSON.parse(data.result) : null;
  };

  // Query to get the latest document draft
  const { 
    data: latestDraft, 
    isLoading: isLoadingLatestDraft
  } = useQuery({
    queryKey: ['latest-document-draft', caseId],
    queryFn: getLatestDocumentDraft,
    enabled: !!caseId
  });

  // Mutation to draft a document
  const draftDocument = useMutation({
    mutationFn: async ({ documentType, additionalInput }: { documentType: string, additionalInput?: string }) => {
      if (!caseId) {
        throw new Error('ID do caso não fornecido');
      }
      
      setIsDrafting(true);
      
      try {
        // Get the Redator agent
        const redatorAgent = getAgent('redator');
        
        if (!redatorAgent) {
          throw new Error('Agente Redator não encontrado');
        }
        
        // Execute the document drafting
        const result = await redatorAgent.execute({ 
          caseId,
          metadata: { documentType }
        });
        
        if (!result.success) {
          throw new Error(result.message);
        }

        return result.details;
      } finally {
        setIsDrafting(false);
      }
    },
    onSuccess: (data) => {
      toast.success('Documento redigido com sucesso');
      queryClient.invalidateQueries({ queryKey: ['drafted-documents', caseId] });
      queryClient.invalidateQueries({ queryKey: ['latest-document-draft', caseId] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao redigir documento: ${error.message}`);
    }
  });

  return {
    draftedDocuments,
    latestDraft,
    isLoading,
    isLoadingLatestDraft,
    error,
    draftDocument,
    isDrafting,
    documentTypes: DOCUMENT_TYPES,
    selectedDocType,
    setSelectedDocType
  };
}
