
import { supabase } from '@/integrations/supabase/client';
import { VerificationResult, DocumentToVerify } from './types';

export class VerificationService {
  async getLatestDocument(caseId: string): Promise<DocumentToVerify | null> {
    const { data, error } = await supabase
      .from('activities')
      .select('result, action')
      .eq('case_id', caseId)
      .eq('agent', 'redator')
      .like('action', 'Redação de%')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    
    if (!data?.result) return null;
    
    const document = JSON.parse(data.result);
    document.title = data.action.replace('Redação de ', '');
    
    return document;
  }

  async getCaseStrategy(caseId: string): Promise<any> {
    const { data, error } = await supabase
      .from('activities')
      .select('result')
      .eq('case_id', caseId)
      .eq('agent', 'estrategista')
      .like('action', '%estratégia%')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.warn(`Nenhuma estratégia encontrada para o caso ${caseId}`);
      return null;
    }
    
    return data?.result ? JSON.parse(data.result) : null;
  }

  async getFactsAnalysis(caseId: string): Promise<any> {
    const { data, error } = await supabase
      .from('activities')
      .select('result')
      .eq('case_id', caseId)
      .eq('agent', 'analista-fatos')
      .eq('action', 'Análise de fatos')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.warn(`Nenhuma análise de fatos encontrada para o caso ${caseId}`);
      return null;
    }
    
    return data?.result ? JSON.parse(data.result) : null;
  }

  async storeVerificationResult(
    caseId: string,
    verificationResult: VerificationResult,
    documentVerified: DocumentToVerify
  ): Promise<void> {
    const { error } = await supabase
      .from('activities')
      .insert({
        case_id: caseId,
        agent: 'revisor-legal',
        action: `Verificação de ${documentVerified.title || documentVerified.type || 'documento'}`,
        result: JSON.stringify({
          criterios: verificationResult.criteria,
          recomendacoes: verificationResult.recommendations,
          problemas: verificationResult.issuesFound,
          documentoVerificadoId: documentVerified.id,
          documentoTipo: documentVerified.type
        })
      });
      
    if (error) throw new Error(`Erro ao salvar resultado da verificação: ${error.message}`);
  }
}
