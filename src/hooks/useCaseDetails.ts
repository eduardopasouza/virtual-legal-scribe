
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Case, Activity, Deadline, WorkflowStage, Alert } from '@/types/case';
import { DocumentMetadata, useDocuments } from "./useDocuments";
import { useActivitiesList } from "./useActivities";
import { useDeadlines } from "./useDeadlines";
import { handleError } from "@/utils/errorHandling";

interface CaseDetailedData {
  caseData: Case | null;
  activities: Activity[];
  deadlines: Deadline[];
  workflowStages: WorkflowStage[];
  alerts: Alert[];
  documents: DocumentMetadata[];
  isLoading: boolean;
  isLoadingActivities: boolean; // Added this property to match what we're using
  error: Error | null;
}

export function useCaseDetails(caseId?: string): CaseDetailedData {
  const { listDocuments } = useDocuments();
  const { activities, isLoading: isActivitiesLoading } = useActivitiesList(caseId);
  const { deadlines, isLoading: isDeadlinesLoading } = useDeadlines(caseId);

  const { data: caseData, isLoading: isCaseLoading, error: caseError } = useQuery({
    queryKey: ["case", caseId],
    queryFn: async () => {
      if (!caseId) return null;
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .eq("id", caseId)
        .maybeSingle();

      if (error) {
        handleError(error, `Erro ao carregar detalhes do caso ${caseId}`, {
          context: 'Detalhes do Caso'
        });
        throw error;
      }
      return data as Case;
    },
    enabled: !!caseId,
  });

  const { data: workflowStages = [], isLoading: isWorkflowLoading } = useQuery({
    queryKey: ["workflow_stages", caseId],
    queryFn: async () => {
      if (!caseId) return [];
      try {
        const { data, error } = await supabase
          .from("workflow_stages")
          .select("*")
          .eq("case_id", caseId)
          .order("stage_number", { ascending: true });

        if (error) throw error;
        return data as WorkflowStage[];
      } catch (error) {
        handleError(error, "Não foi possível carregar as etapas do fluxo de trabalho", {
          context: 'Fluxo de Trabalho',
          severity: 'medium'
        });
        return [];
      }
    },
    enabled: !!caseId,
  });

  const { data: alerts = [], isLoading: isAlertsLoading } = useQuery({
    queryKey: ["alerts", caseId],
    queryFn: async () => {
      if (!caseId) return [];
      try {
        const { data, error } = await supabase
          .from("alerts")
          .select("*")
          .eq("case_id", caseId)
          .eq("status", "pending")
          .order("priority", { ascending: false });

        if (error) throw error;
        return data as Alert[];
      } catch (error) {
        handleError(error, "Não foi possível carregar os alertas", {
          context: 'Alertas do Caso',
          severity: 'low'
        });
        return [];
      }
    },
    enabled: !!caseId,
  });

  const { data: documents = [], isLoading: isDocumentsLoading } = useQuery({
    queryKey: ["documents", caseId],
    queryFn: async () => {
      if (!caseId) return [];
      try {
        return await listDocuments(caseId);
      } catch (error) {
        handleError(error, "Não foi possível carregar a lista de documentos", {
          context: 'Documentos',
          severity: 'medium'
        });
        return [];
      }
    },
    enabled: !!caseId,
  });

  const isLoading =
    isCaseLoading ||
    isActivitiesLoading ||
    isDeadlinesLoading ||
    isWorkflowLoading ||
    isAlertsLoading ||
    isDocumentsLoading;

  return {
    caseData,
    activities,
    deadlines,
    workflowStages,
    alerts,
    documents,
    isLoading,
    isLoadingActivities: isActivitiesLoading, // Expose this property explicitly
    error: caseError as Error | null,
  };
}
