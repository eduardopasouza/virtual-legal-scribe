
import { supabase } from "@/integrations/supabase/client";
import type { WorkflowStage } from "@/types/case";

export async function atualizarEtapa(id: string, dadosAtualizacao: Partial<WorkflowStage>) {
  const { data, error } = await supabase
    .from('workflow_stages')
    .update(dadosAtualizacao)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
