
export interface Case {
  id: string;
  title: string;
  number?: string;
  client: string;
  description?: string;
  type?: string;
  court?: string;
  status: 'em_andamento' | 'concluido' | 'arquivado';
  main_agent: string;
  created_at: string;
  updated_at: string;
  area_direito?: string;
}

export interface Activity {
  id: string;
  case_id: string;
  agent: string;
  action: string;
  result?: string;
  status: 'pendente' | 'em_processamento' | 'concluido' | 'erro';
  created_at: string;
}

export interface Deadline {
  id: string;
  case_id: string;
  description: string;
  date: string;
  status: 'pendente' | 'concluido' | 'atrasado';
  created_at: string;
}

export interface WorkflowStage {
  id: string;
  case_id: string;
  stage_number: number;
  stage_name: string;
  status: 'pending' | 'in_progress' | 'completed';
  started_at?: string;
  completed_at?: string;
  created_at?: string;
  created_by?: string;
}

export interface Alert {
  id: string;
  case_id: string;
  title: string;
  description?: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'resolved';
  created_at?: string;
  resolved_at?: string;
}
