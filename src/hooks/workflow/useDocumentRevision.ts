
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAgent } from '@/agents';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useDocumentRevision(caseId?: string) {
  const queryClient = useQueryClient();
  const [isRevising, setIsRevising] = useState(false);
  
  // Fetch existing revision results
  const fetchRevisionResults = async () => {
    if (!caseId) return [];
    
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('case_id', caseId)
      .eq('agent', 'revisor-integrador')
      .like('action', 'Revisão de%')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data?.map(item => ({
      id: item.id,
      documentTitle: item.action.replace('Revisão de ', ''),
      result: JSON.parse(item.result || '{}'),
      createdAt: item.created_at
    })) || [];
  };

  // Query to get revision results
  const { 
    data: revisionResults, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['document-revisions', caseId],
    queryFn: fetchRevisionResults,
    enabled: !!caseId
  });

  // Get the latest revision result
  const getLatestRevision = async () => {
    if (!caseId) return null;
    
    const { data, error } = await supabase
      .from('activities')
      .select('result')
      .eq('case_id', caseId)
      .eq('agent', 'revisor-integrador')
      .like('action', 'Revisão de%')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    
    return data?.result ? JSON.parse(data.result) : null;
  };

  // Query to get the latest revision result
  const { 
    data: latestRevision, 
    isLoading: isLoadingLatestRevision
  } = useQuery({
    queryKey: ['latest-revision', caseId],
    queryFn: getLatestRevision,
    enabled: !!caseId
  });

  // Mutation to revise a document
  const reviseDocument = useMutation({
    mutationFn: async ({ documentId }: { documentId?: string }) => {
      if (!caseId) {
        throw new Error('ID do caso não fornecido');
      }
      
      setIsRevising(true);
      
      try {
        // Get the RevisorIntegrador agent
        const revisorIntegradorAgent = getAgent('revisor-integrador');
        
        if (!revisorIntegradorAgent) {
          throw new Error('Agente RevisorIntegrador não encontrado');
        }
        
        // Execute the document revision
        const result = await revisorIntegradorAgent.execute({ 
          caseId,
          metadata: { documentId }
        });
        
        if (!result.success) {
          throw new Error(result.message);
        }

        return result.details;
      } finally {
        setIsRevising(false);
      }
    },
    onSuccess: (data) => {
      toast.success('Documento revisado e finalizado com sucesso!');
      
      queryClient.invalidateQueries({ queryKey: ['document-revisions', caseId] });
      queryClient.invalidateQueries({ queryKey: ['latest-revision', caseId] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao revisar documento: ${error.message}`);
    }
  });

  return {
    revisionResults,
    latestRevision,
    isLoading,
    isLoadingLatestRevision,
    error,
    reviseDocument,
    isRevising,
    refetchRevisions: refetch
  };
}
