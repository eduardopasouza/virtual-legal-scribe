
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAgent } from '@/agents';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function useFactsAnalysis(caseId?: string) {
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch existing facts analysis from the database
  const fetchFactsAnalysis = async () => {
    if (!caseId) return null;
    
    const { data, error } = await supabase
      .from('activities')
      .select('result') // Changed from 'details' to 'result' to match schema
      .eq('case_id', caseId)
      .eq('agent', 'analista-fatos')
      .eq('action', 'Análise de fatos')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    
    return data?.result ? JSON.parse(data.result) : null;
  };

  // Query to get facts analysis
  const { 
    data: factsAnalysis, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['facts-analysis', caseId],
    queryFn: fetchFactsAnalysis,
    enabled: !!caseId
  });

  // Mutation to perform facts analysis
  const executeFactsAnalysis = useMutation({
    mutationFn: async () => {
      if (!caseId) {
        throw new Error('ID do caso não fornecido');
      }
      
      setIsAnalyzing(true);
      
      try {
        // Get the Facts Analyst agent
        const factsAnalystAgent = getAgent('analista-fatos');
        
        if (!factsAnalystAgent) {
          throw new Error('Agente Analista de Fatos não encontrado');
        }
        
        // Execute the facts analysis
        const result = await factsAnalystAgent.execute({ caseId });
        
        if (!result.success) {
          throw new Error(result.message);
        }

        // Store the result in the database as a JSON string
        const { error } = await supabase
          .from('activities')
          .insert({
            case_id: caseId,
            agent: 'analista-fatos',
            action: 'Análise de fatos',
            result: JSON.stringify(result.details)
          });
          
        if (error) throw error;
        
        return result.details;
      } finally {
        setIsAnalyzing(false);
      }
    },
    onSuccess: (data) => {
      toast.success('Análise de fatos concluída com sucesso');
      queryClient.invalidateQueries({ queryKey: ['facts-analysis', caseId] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao realizar análise de fatos: ${error.message}`);
    }
  });

  return {
    factsAnalysis,
    isLoading,
    error,
    executeFactsAnalysis,
    isAnalyzing
  };
}
