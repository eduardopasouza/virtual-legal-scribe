
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAgent } from '@/agents';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type SpecialtyType = 'constitutional' | 'international' | 'interdisciplinary' | 'technical';

export function useAdvancedLayersAnalysis(caseId?: string) {
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyType>('constitutional');

  // Fetch existing advanced analyses from the database
  const fetchAdvancedAnalyses = async () => {
    if (!caseId) return null;
    
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('case_id', caseId)
      .eq('agent', 'especialista-adaptavel')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data?.map(item => ({
      id: item.id,
      type: JSON.parse(item.result || '{}').details?.specialtyType || 'unknown',
      createdAt: item.created_at,
      details: JSON.parse(item.result || '{}').details || {}
    })) || [];
  };

  // Query to get advanced analyses
  const { 
    data: advancedAnalyses, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['advanced-analyses', caseId],
    queryFn: fetchAdvancedAnalyses,
    enabled: !!caseId
  });

  // Get the latest analysis
  const getLatestAdvancedAnalysis = async () => {
    if (!caseId) return null;
    
    const { data, error } = await supabase
      .from('activities')
      .select('result')
      .eq('case_id', caseId)
      .eq('agent', 'especialista-adaptavel')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    
    return data?.result ? JSON.parse(data.result).details : null;
  };

  // Query to get the latest advanced analysis
  const { 
    data: latestAnalysis, 
    isLoading: isLoadingLatest
  } = useQuery({
    queryKey: ['latest-advanced-analysis', caseId],
    queryFn: getLatestAdvancedAnalysis,
    enabled: !!caseId
  });

  // Mutation to execute advanced analysis
  const executeAdvancedAnalysis = useMutation({
    mutationFn: async ({ specialtyType }: { specialtyType: SpecialtyType }) => {
      if (!caseId) {
        throw new Error('ID do caso não fornecido');
      }
      
      setIsAnalyzing(true);
      
      try {
        // Get the Especialista Adaptavel agent
        const especialistaAdaptavel = getAgent('especialista-adaptavel');
        
        if (!especialistaAdaptavel) {
          throw new Error('Agente Especialista Adaptável não encontrado');
        }
        
        // Execute the advanced analysis
        const result = await especialistaAdaptavel.execute({ 
          caseId,
          metadata: { specialtyType }
        });
        
        if (!result.success) {
          throw new Error(result.message);
        }

        return result.details;
      } finally {
        setIsAnalyzing(false);
      }
    },
    onSuccess: () => {
      toast.success('Análise avançada realizada com sucesso');
      queryClient.invalidateQueries({ queryKey: ['advanced-analyses', caseId] });
      queryClient.invalidateQueries({ queryKey: ['latest-advanced-analysis', caseId] });
    },
    onError: (error: Error) => {
      toast.error(`Erro ao realizar análise avançada: ${error.message}`);
    }
  });

  return {
    advancedAnalyses,
    latestAnalysis,
    isLoading,
    isLoadingLatest,
    error,
    executeAdvancedAnalysis,
    isAnalyzing,
    specialtyTypes: ['constitutional', 'international', 'interdisciplinary', 'technical'] as SpecialtyType[],
    selectedSpecialty,
    setSelectedSpecialty
  };
}
