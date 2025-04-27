
import { DocumentMetadata } from "@/hooks/useDocuments";
import { Case } from "@/types/case";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

// Função simulada para chamar o Analista de Requisitos
export async function chamarAnalistaRequisitos(
  documentos: DocumentMetadata[],
  caso: Case
): Promise<any> {
  // Esta é uma função simulada que normalmente chamaria uma API
  // Vamos simular um tempo de processamento
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Retorna uma análise simulada
  return {
    resultado: "Documentos analisados com sucesso",
    recomendações: [
      "Anexar comprovante de residência",
      "Verificar prazo prescricional",
      "Incluir jurisprudência favorável"
    ],
    risco: "médio",
    prazo_estimado: "45 dias",
    pontos_atenção: "Caso com potencial de acordo extrajudicial"
  };
}

// Cria uma análise no banco de dados
export async function criarAnalise({ 
  caso_id, 
  agente, 
  conteudo 
}: { 
  caso_id: string; 
  agente: string; 
  conteudo: string; 
}): Promise<void> {
  const { error } = await supabase
    .from("activities")
    .insert({
      id: uuidv4(),
      case_id: caso_id,
      agent: agente,
      action: "Análise realizada",
      result: conteudo,
      status: "concluido",
    });

  if (error) throw error;
}

// Atualiza a etapa do fluxo de trabalho
export async function atualizarEtapa(
  caso_id: string,
  nome_etapa: string,
  status: 'pending' | 'in_progress' | 'completed'
): Promise<void> {
  // Primeiro verifica se a etapa existe
  const { data: etapas, error: errorFetch } = await supabase
    .from("workflow_stages")
    .select("*")
    .eq("case_id", caso_id)
    .eq("stage_name", nome_etapa);

  if (errorFetch) throw errorFetch;

  if (etapas && etapas.length > 0) {
    // Etapa existe, atualiza o status
    const { error } = await supabase
      .from("workflow_stages")
      .update({ 
        status,
        ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {}),
        ...(status === 'in_progress' ? { started_at: new Date().toISOString() } : {})
      })
      .eq("case_id", caso_id)
      .eq("stage_name", nome_etapa);

    if (error) throw error;
  } else {
    // Etapa não existe, cria nova
    const stageNumber = nome_etapa === 'reception' ? 1 : 
                       nome_etapa === 'planning' ? 2 : 
                       nome_etapa === 'analysis' ? 3 : 
                       nome_etapa === 'research' ? 4 : 
                       nome_etapa === 'drafting' ? 5 : 
                       nome_etapa === 'review' ? 6 : 7;

    const stageName = nome_etapa === 'reception' ? 'Recepção e Triagem' : 
                     nome_etapa === 'planning' ? 'Planejamento Estratégico' : 
                     nome_etapa === 'analysis' ? 'Análise Jurídica' : 
                     nome_etapa === 'research' ? 'Pesquisa e Fundamentação' : 
                     nome_etapa === 'drafting' ? 'Elaboração de Documento' : 
                     nome_etapa === 'review' ? 'Verificação e Revisão' : 'Entrega e Feedback';

    const { error } = await supabase
      .from("workflow_stages")
      .insert({
        id: uuidv4(),
        case_id: caso_id,
        stage_name: nome_etapa,
        stage_number: stageNumber,
        status,
        ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {}),
        ...(status === 'in_progress' ? { started_at: new Date().toISOString() } : {})
      });

    if (error) throw error;
  }
}
