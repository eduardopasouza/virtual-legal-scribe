
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
