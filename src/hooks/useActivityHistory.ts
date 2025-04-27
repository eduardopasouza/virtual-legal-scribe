import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { Activity } from '@/types/history';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export function useActivityHistory() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('newest');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  
  const { toast } = useToast();

  // Fetch activities from the database
  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        // Simulating data fetch - in a real app, we'd load from the database
        // Initially we'll use the mock data
        // Later we can replace this with actual database fetch
        
        // For demo purposes, let's use the mock data
        const mockActivities = [
          {
            id: '1',
            type: 'document',
            action: 'Documento criado',
            agent: 'Redator',
            caseId: '1',
            caseName: 'Ação de Indenização por Danos Morais',
            date: new Date('2024-04-20T15:30:00'),
            details: 'Petição Inicial criada'
          },
          {
            id: '2',
            type: 'document',
            action: 'Documento analisado',
            agent: 'Analisador',
            caseId: '1',
            caseName: 'Ação de Indenização por Danos Morais',
            date: new Date('2024-04-20T16:15:00'),
            details: 'Análise da Petição Inicial concluída'
          },
          {
            id: '3',
            type: 'case',
            action: 'Caso atualizado',
            agent: 'Estrategista',
            caseId: '1',
            caseName: 'Ação de Indenização por Danos Morais',
            date: new Date('2024-04-20T17:00:00'),
            details: 'Estratégia do caso definida'
          },
          {
            id: '4',
            type: 'document',
            action: 'Documento revisado',
            agent: 'Revisor',
            caseId: '1',
            caseName: 'Ação de Indenização por Danos Morais',
            date: new Date('2024-04-21T09:45:00'),
            details: 'Revisão da Petição Inicial concluída'
          },
          {
            id: '5',
            type: 'case',
            action: 'Novo caso criado',
            agent: 'Recepcionista',
            caseId: '2',
            caseName: 'Processo Tributário - Impugnação de Débito',
            date: new Date('2024-04-22T10:30:00'),
            details: 'Caso aberto para Empresa ABC Ltda'
          },
          {
            id: '6',
            type: 'document',
            action: 'Documento enviado',
            agent: 'Supervisor',
            caseId: '1',
            caseName: 'Ação de Indenização por Danos Morais',
            date: new Date('2024-04-22T14:20:00'),
            details: 'Petição Inicial enviada ao cliente para revisão'
          },
          {
            id: '7',
            type: 'system',
            action: 'Backup realizado',
            agent: 'Sistema',
            date: new Date('2024-04-22T23:00:00'),
            details: 'Backup automático de todos os dados do sistema'
          },
          {
            id: '8',
            type: 'document',
            action: 'Documento aprovado',
            agent: 'Supervisor',
            caseId: '1',
            caseName: 'Ação de Indenização por Danos Morais',
            date: new Date('2024-04-23T09:15:00'),
            details: 'Petição Inicial aprovada pelo cliente'
          },
          {
            id: '9',
            type: 'case',
            action: 'Caso atualizado',
            agent: 'Pesquisador',
            caseId: '2',
            caseName: 'Processo Tributário - Impugnação de Débito',
            date: new Date('2024-04-23T11:40:00'),
            details: 'Jurisprudências relevantes localizadas'
          },
          {
            id: '10',
            type: 'system',
            action: 'Manutenção programada',
            agent: 'Sistema',
            date: new Date('2024-04-23T22:00:00'),
            details: 'Manutenção programada do sistema concluída'
          },
          {
            id: '11',
            type: 'document',
            action: 'Documento criado',
            agent: 'Redator',
            caseId: '2',
            caseName: 'Processo Tributário - Impugnação de Débito',
            date: new Date('2024-04-24T14:30:00'),
            details: 'Impugnação de débito criada'
          },
          {
            id: '12',
            type: 'deadline',
            action: 'Prazo adicionado',
            agent: 'Supervisor',
            caseId: '1',
            caseName: 'Ação de Indenização por Danos Morais',
            date: new Date('2024-04-25T10:00:00'),
            details: 'Prazo para contestação adicionado: 15/05/2024'
          },
          {
            id: '13',
            type: 'deadline',
            action: 'Prazo atrasado',
            agent: 'Sistema',
            caseId: '3',
            caseName: 'Processo de Execução Fiscal',
            date: new Date('2024-04-25T18:00:00'),
            details: 'Alerta: Prazo para pagamento de custas expirou'
          }
        ];
        
        setActivities(mockActivities);

        // In the future, we can implement the actual fetching logic:
        /*
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Map activities to our Activity type
        const mappedActivities = data.map(item => ({
          id: item.id,
          type: mapActivityType(item.type) as Activity['type'],
          action: item.action,
          agent: item.agent,
          caseId: item.case_id,
          caseName: item.case_name, // This might need to be fetched separately
          date: new Date(item.created_at),
          details: item.result
        }));

        setActivities(mappedActivities);
        */
      } catch (error) {
        console.error("Error fetching activities:", error);
        toast({
          title: "Erro ao carregar atividades",
          description: "Não foi possível carregar o histórico de atividades.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [toast]);

  // Filter activities based on search term and filters
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesAction = activity.action.toLowerCase().includes(searchLower);
        const matchesAgent = activity.agent.toLowerCase().includes(searchLower);
        const matchesCase = activity.caseName?.toLowerCase().includes(searchLower);
        const matchesDetails = activity.details?.toLowerCase().includes(searchLower);
        
        if (!(matchesAction || matchesAgent || matchesCase || matchesDetails)) {
          return false;
        }
      }
      
      // Date filter
      if (dateFilter !== 'all') {
        const now = new Date();
        if (dateFilter === 'today') {
          const isToday = activity.date.getDate() === now.getDate() && 
                         activity.date.getMonth() === now.getMonth() && 
                         activity.date.getFullYear() === now.getFullYear();
          if (!isToday) return false;
        } else if (dateFilter === 'week') {
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (activity.date < oneWeekAgo) return false;
        } else if (dateFilter === 'month') {
          const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          if (activity.date < oneMonthAgo) return false;
        } else if (dateFilter === 'quarter') {
          const oneQuarterAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
          if (activity.date < oneQuarterAgo) return false;
        }
      }
      
      // Type filter
      if (typeFilter !== 'all' && activity.type !== typeFilter) {
        return false;
      }
      
      return true;
    });
  }, [activities, searchTerm, dateFilter, typeFilter]);
  
  // Sort activities based on sort order
  const sortedActivities = useMemo(() => {
    return [...filteredActivities].sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.date.getTime() - a.date.getTime();
      } else {
        return a.date.getTime() - b.date.getTime();
      }
    });
  }, [filteredActivities, sortOrder]);
  
  // Group activities by date
  const groupedActivities = useMemo(() => {
    const grouped: Record<string, Activity[]> = {};
    
    sortedActivities.forEach(activity => {
      const dateKey = format(activity.date, 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
    });
    
    return grouped;
  }, [sortedActivities]);

  const handleViewDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setDialogOpen(true);
  };

  return {
    activities: sortedActivities,
    groupedActivities,
    isLoading,
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    typeFilter,
    setTypeFilter,
    sortOrder,
    setSortOrder,
    selectedActivity,
    dialogOpen,
    setDialogOpen,
    handleViewDetails
  };
}
