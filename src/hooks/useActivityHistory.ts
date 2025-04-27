import { useEffect } from 'react';
import { Activity, ActivityType } from '@/types/history';
import { useActivityState } from './activity/useActivityState';
import { useActivityFilters } from './activity/useActivityFilters';
import { useActivitySorting } from './activity/useActivitySorting';

export function useActivityHistory() {
  const {
    activities,
    setActivities,
    isLoading,
    setIsLoading,
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
    handleViewDetails,
    toast
  } = useActivityState();

  // Fetch activities on mount
  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        // For now, using mock data as per the original implementation
        // Later we can replace this with actual API calls
        const mockActivities: Activity[] = [
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

  const filteredActivities = useActivityFilters({
    activities,
    searchTerm,
    dateFilter,
    typeFilter
  });

  const { sortedActivities, groupedActivities } = useActivitySorting({
    activities: filteredActivities,
    sortOrder
  });

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
