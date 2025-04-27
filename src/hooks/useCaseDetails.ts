
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Case, Activity, Deadline, WorkflowStage, Alert } from "@/types/case";
import { DocumentMetadata, useDocuments } from "./useDocuments";
import { useActivities } from "./useActivities";
import { useDeadlines } from "./useDeadlines";

interface CaseDetailedData {
  caseData: Case | null;
  activities: Activity[];
  deadlines: Deadline[];
  workflowStages: WorkflowStage[];
  alerts: Alert[];
  documents: DocumentMetadata[];
  isLoading: boolean;
  error: Error | null;
}

export function useCaseDetails(caseId?: string): CaseDetailedData {
  const { listDocuments } = useDocuments();
  const { activities, isLoading: isActivitiesLoading } = useActivities(caseId);
  const { deadlines, isLoading: isDeadlinesLoading } = useDeadlines(caseId);

  const { data: caseData, isLoading: isCaseLoading, error: caseError } = useQuery({
    queryKey: ["case", caseId],
    queryFn: async () => {
      if (!caseId) return null;
      const { data, error } = await supabase
        .from("cases")
        .select("*")
        .eq("id", caseId)
        .single();

      if (error) throw error;
      return data as Case;
    },
    enabled: !!caseId,
  });

  const { data: workflowStages = [], isLoading: isWorkflowLoading } = useQuery({
    queryKey: ["workflow_stages", caseId],
    queryFn: async () => {
      if (!caseId) return [];
      const { data, error } = await supabase
        .from("workflow_stages")
        .select("*")
        .eq("case_id", caseId)
        .order("stage_number", { ascending: true });

      if (error) throw error;
      return data as WorkflowStage[];
    },
    enabled: !!caseId,
  });

  const { data: alerts = [], isLoading: isAlertsLoading } = useQuery({
    queryKey: ["alerts", caseId],
    queryFn: async () => {
      if (!caseId) return [];
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .eq("case_id", caseId)
        .eq("status", "pending")
        .order("priority", { ascending: false });

      if (error) throw error;
      return data as Alert[];
    },
    enabled: !!caseId,
  });

  const { data: documents = [], isLoading: isDocumentsLoading } = useQuery({
    queryKey: ["documents", caseId],
    queryFn: async () => {
      if (!caseId) return [];
      return await listDocuments(caseId);
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
    error: caseError as Error | null,
  };
}
