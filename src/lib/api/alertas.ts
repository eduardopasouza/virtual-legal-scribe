
import { supabase } from "@/integrations/supabase/client";
import type { Alert } from "@/types/case";

export async function criarAlerta(novoAlerta: Omit<Alert, 'id' | 'created_at' | 'resolved_at'>) {
  const { data, error } = await supabase
    .from('alerts')
    .insert(novoAlerta)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function resolverAlerta(alertaId: string) {
  const { data, error } = await supabase
    .from('alerts')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString()
    })
    .eq('id', alertaId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function listarAlertas(caseId?: string, status: 'pending' | 'resolved' | 'all' = 'pending') {
  let query = supabase
    .from('alerts')
    .select('*')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });
  
  if (caseId) {
    query = query.eq('case_id', caseId);
  }
  
  if (status !== 'all') {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;

  if (error) throw error;
  return data;
}
