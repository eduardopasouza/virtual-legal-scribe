
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Case } from '@/types/case';
import { useAuth } from '@/lib/auth/AuthContext';
import { useNotifications } from '@/components/notification/NotificationSystem';

interface CaseFilters {
  status?: string;
  area?: string;
}

interface CreateCaseInput {
  title: string;
  client: string;
  description?: string;
  area_direito?: string;
  type?: string;
  court?: string;
  status?: 'em_andamento' | 'concluido' | 'arquivado';
  main_agent?: string;
  created_by?: string;
}

export function useCaseOperations() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const { data: cases, isLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Case[];
    }
  });

  const createCase = useMutation({
    mutationFn: async (newCase: CreateCaseInput) => {
      const caseWithUser = {
        ...newCase,
        created_by: user?.id
      };

      const { data, error } = await supabase
        .from('cases')
        .insert([caseWithUser])
        .select()
        .single();

      if (error) throw error;
      
      addNotification(
        'success',
        'Caso criado com sucesso',
        `O caso "${newCase.title}" foi criado.`,
        'case'
      );
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    }
  });

  const listCasesWithFilters = async ({ status, area }: CaseFilters = {}) => {
    let query = supabase.from('cases').select('*');
    
    if (user) {
      query = query.eq('created_by', user.id);
    }
    
    if (status) query = query.eq('status', status);
    if (area) query = query.eq('area_direito', area);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  };

  return {
    cases,
    isLoading,
    createCase,
    listCasesWithFilters
  };
}
