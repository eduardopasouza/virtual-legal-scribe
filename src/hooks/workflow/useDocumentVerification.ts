
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAgent } from '@/agents';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useDocumentVerification(caseId?: string) {
  const queryClient = useQueryClient();
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Fetch existing verification results
  const fetchVerificationResults = async () => {
    if (!caseId) return [];
    
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('case_id', caseId)
      .eq('agent', 'revisor-legal')
      .like('action', 'Verificação de%')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data?.map(item => ({
      id: item.id,
      documentTitle: item.action.replace('Verificação de ', ''),
      result: JSON.parse(item.result || '{}'),
      createdAt: item.created_at
    })) || [];
  };

  // Query to get verification results
  const { 
    data: verificationResults, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['document-verifications', caseId],
    queryFn: fetchVerificationResults,
    enabled: !!caseId
  });

  // Get the latest verification result
  const getLatestVerification = async () => {
    if (!caseId) return null;
    
    const { data, error } = await supabase
      .from('activities')
      .select('result')
      .eq('case_id', caseId)
      .eq('agent', 'revisor-legal')
      .like('action', 'Verificação de%')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    
    return data?.result ? JSON.parse(data.result) : null;
  };

  // Query to get the latest verification result
  const { 
    data: latestVerification, 
    isLoading: isLoadingLatestVerification
  } = useQuery({
    queryKey: ['latest-verification', caseId],
    queryFn: getLatestVerification,
    enabled: !!caseId
  });

  // Mutation to verify a document
  const verifyDocument = useMutation({
    mutationFn: async ({ documentId }: { documentId?: string }) => {
      if (!caseId) {
        throw new Error('ID do caso não fornecido');
      }
      
      setIsVerifying(true);
      
      try {
        // Get the RevisorLegal agent
        const revisorLegalAgent = getAgent('revisor-legal');
        
        if (!revisorLegalAgent) {
          throw new Error('Agente RevisorLegal não encontrado');
        }
        
        // Execute the document verification
        const result = await revisorLegalAgent.execute({ 
          caseId,
          metadata: { documentId }
        });
        
        if (!result.success) {
          throw new Error(result.message);
        }

        return result.details;
      } finally {
        setIsVerifying(false);
      }
    },
    onSuccess: (data) => {
      toast.success(data.verificacaoPositiva 
        ? 'Documento verificado e aprovado!' 
        : 'Documento verificado com ressalvas');
      
      queryClient.invalidateQueries({ queryKey: ['document-verifications', caseId] });
      queryClient.invalidateQueries({ queryKey: ['latest-verification', caseId] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao verificar documento: ${error.message}`);
    }
  });

  return {
    verificationResults,
    latestVerification,
    isLoading,
    isLoadingLatestVerification,
    error,
    verifyDocument,
    isVerifying,
    refetchVerifications: refetch
  };
}
