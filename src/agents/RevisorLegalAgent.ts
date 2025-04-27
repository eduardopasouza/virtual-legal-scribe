
import { AgentTask, AgentResult } from '@/types/agent';
import { BaseAgent } from './base/BaseAgent';
import { supabase } from '@/integrations/supabase/client';

interface VerificationCriteria {
  formalRequirements: boolean;
  legalCompliance: boolean;
  citations: boolean;
  logicalCoherence: boolean;
  alignmentWithObjectives: boolean;
}

export class RevisorLegalAgent extends BaseAgent {
  constructor() {
    super(
      'revisor-legal',
      'Verificador de Conformidade',
      'Verifica requisitos formais, conformidade legal, citações, coerência lógica e alinhamento com objetivos'
    );
  }

  async execute({ caseId, input, metadata }: AgentTask): Promise<AgentResult> {
    try {
      console.log(`RevisorLegalAgent: Iniciando verificação para o caso ${caseId}`);

      if (!caseId) {
        return {
          success: false,
          message: "ID do caso não fornecido"
        };
      }

      // Obter o documento mais recente para verificação
      const documentToVerify = await this.getLatestDocument(caseId);
      if (!documentToVerify) {
        return {
          success: false,
          message: "Nenhum documento encontrado para verificação"
        };
      }

      // Obter a estratégia e objetivos do caso para verificação de alinhamento
      const strategyData = await this.getCaseStrategy(caseId);
      
      // Obter a análise de fatos para verificação de coerência
      const factsAnalysis = await this.getFactsAnalysis(caseId);

      // Realizar a verificação do documento
      const verificationResult = await this.verifyDocument(
        documentToVerify,
        strategyData,
        factsAnalysis
      );

      // Armazenar o resultado da verificação
      await this.storeVerificationResult(caseId, verificationResult, documentToVerify);

      // Determinar se o documento passou na verificação
      const passedVerification = this.documentPassedVerification(verificationResult);

      return {
        success: true,
        message: passedVerification 
          ? "Documento verificado e aprovado" 
          : "Documento verificado com ressalvas",
        details: {
          documentoTipo: documentToVerify.type,
          verificacaoPositiva: passedVerification,
          criteriosAprovados: Object.entries(verificationResult.criteria)
            .filter(([_, value]) => value)
            .map(([key]) => this.formatCriteriaName(key)),
          criteriosReprovados: Object.entries(verificationResult.criteria)
            .filter(([_, value]) => !value)
            .map(([key]) => this.formatCriteriaName(key)),
          recomendacoes: verificationResult.recommendations,
          dataVerificacao: new Date().toISOString()
        }
      };
    } catch (error: any) {
      console.error(`RevisorLegalAgent: Erro na verificação:`, error);
      
      return {
        success: false,
        message: `Erro ao verificar documento: ${error.message}`
      };
    }
  }

  /**
   * Formata o nome do critério para exibição
   */
  private formatCriteriaName(key: string): string {
    const formattingMap: Record<string, string> = {
      'formalRequirements': 'Requisitos Formais',
      'legalCompliance': 'Conformidade Legal',
      'citations': 'Citações e Referências',
      'logicalCoherence': 'Coerência Lógica',
      'alignmentWithObjectives': 'Alinhamento com Objetivos'
    };

    return formattingMap[key] || key;
  }

  /**
   * Recupera o documento mais recente do caso
   */
  private async getLatestDocument(caseId: string): Promise<any> {
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

  /**
   * Recupera a estratégia do caso
   */
  private async getCaseStrategy(caseId: string): Promise<any> {
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

  /**
   * Recupera a análise de fatos do caso
   */
  private async getFactsAnalysis(caseId: string): Promise<any> {
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

  /**
   * Realiza a verificação do documento
   */
  private async verifyDocument(document: any, strategy: any, facts: any): Promise<{
    criteria: VerificationCriteria;
    recommendations: string[];
    issuesFound: string[];
  }> {
    // Em uma implementação completa, aqui teríamos verificações detalhadas
    // por enquanto, simularemos o processo com verificações básicas

    const content = document.content || '';
    const documentType = document.type || '';
    const recommendations: string[] = [];
    const issuesFound: string[] = [];
    
    // Critérios de verificação
    const criteria: VerificationCriteria = {
      formalRequirements: true,
      legalCompliance: true,
      citations: true,
      logicalCoherence: true,
      alignmentWithObjectives: true
    };

    // 1. Verificar requisitos formais
    if (!this.checkFormalRequirements(content, documentType)) {
      criteria.formalRequirements = false;
      issuesFound.push("Ausência de elementos formais obrigatórios");
      recommendations.push("Revisar estrutura formal do documento. Certifique-se que contém todas as seções necessárias.");
    }
    
    // 2. Verificar conformidade legal
    if (!this.checkLegalCompliance(content)) {
      criteria.legalCompliance = false;
      issuesFound.push("Possíveis inconsistências na aplicação das leis");
      recommendations.push("Verificar se as referências legais estão atualizadas e são aplicáveis ao caso.");
    }
    
    // 3. Verificar citações e referências
    if (!this.checkCitations(content)) {
      criteria.citations = false;
      issuesFound.push("Citações ou referências incompletas/incorretas");
      recommendations.push("Revisar as citações legais e jurisprudenciais, assegurando-se de que estão completas e precisas.");
    }
    
    // 4. Verificar coerência lógica
    if (!this.checkLogicalCoherence(content, facts)) {
      criteria.logicalCoherence = false;
      issuesFound.push("Possíveis inconsistências lógicas na argumentação");
      recommendations.push("Revisar a coerência entre os fatos apresentados e os argumentos desenvolvidos.");
    }
    
    // 5. Verificar alinhamento com objetivos
    if (!this.checkAlignmentWithObjectives(content, strategy)) {
      criteria.alignmentWithObjectives = false;
      issuesFound.push("Desalinhamento com os objetivos estratégicos");
      recommendations.push("Revisar se o documento atende a todos os objetivos estratégicos definidos para o caso.");
    }
    
    // Adicionar recomendações gerais se necessário
    if (issuesFound.length > 0) {
      recommendations.push("Considere revisar o documento com auxílio de um especialista antes da entrega final.");
    }
    
    return {
      criteria,
      recommendations,
      issuesFound
    };
  }
  
  /**
   * Verifica se o documento atende aos requisitos formais básicos
   */
  private checkFormalRequirements(content: string, documentType: string): boolean {
    const requiredElements: Record<string, string[]> = {
      'peticao-inicial': ['Excelentíssimo', 'Pede deferimento', 'qualificação'],
      'contestacao': ['Excelentíssimo', 'preliminar', 'mérito'],
      'recurso': ['Excelentíssimo', 'tempestividade', 'reforma'],
      'parecer': ['parecer', 'análise', 'conclusão']
    };
    
    const elementsToCheck = requiredElements[documentType] || ['Excelentíssimo', 'Pede deferimento'];
    
    return elementsToCheck.every(element => 
      content.toLowerCase().includes(element.toLowerCase())
    );
  }
  
  /**
   * Verifica se há problemas óbvios na aplicação das leis
   */
  private checkLegalCompliance(content: string): boolean {
    // Esta é uma simplificação. Em um sistema real, verificaríamos
    // validade das leis citadas, adequação ao caso, etc.
    
    // Verifica se há referências a leis
    const hasLegalReferences = /art(\.|igo)\s+\d+|lei\s+\d+/i.test(content);
    
    // Verifica se não há referências a leis notoriamente revogadas
    // (simplificado para exemplo)
    const hasObviousErrors = content.toLowerCase().includes('código civil de 1916') && 
                             !content.toLowerCase().includes('histórico') &&
                             !content.toLowerCase().includes('revogado');
    
    return hasLegalReferences && !hasObviousErrors;
  }
  
  /**
   * Verifica problemas em citações e referências
   */
  private checkCitations(content: string): boolean {
    // Verifica se há citações de jurisprudência mal-formatadas
    const hasCitations = /STF|STJ|TJ|TRF/i.test(content);
    
    // Verifica se as citações seguem um padrão minimamente aceitável
    // (simplificado para exemplo)
    if (hasCitations) {
      const wellFormatted = /STF|STJ|TRF|TJ[\w-]*\s+(RE|HC|MS|ADI|REsp|AC|AG)[\s.]+\d+/i.test(content);
      return wellFormatted;
    }
    
    return true; // Se não há citações, não há erro de formato
  }
  
  /**
   * Verifica a coerência lógica entre os fatos e argumentos
   */
  private checkLogicalCoherence(content: string, facts: any): boolean {
    // Em um sistema real, verificaríamos se todos os fatos relevantes
    // foram abordados e se não há contradições lógicas
    
    // Se não temos análise de fatos, presumimos que está ok
    if (!facts) return true;
    
    // Verifica se os fatos principais estão mencionados no documento
    if (facts.fatosRelevantes && Array.isArray(facts.fatosRelevantes)) {
      const contentLower = content.toLowerCase();
      const missingFacts = facts.fatosRelevantes.filter((fato: string) => 
        !contentLower.includes(fato.toLowerCase().substring(0, 20))
      );
      
      // Se mais de 30% dos fatos relevantes estão ausentes, há problema
      return missingFacts.length <= 0.3 * facts.fatosRelevantes.length;
    }
    
    return true;
  }
  
  /**
   * Verifica se o documento está alinhado com os objetivos estratégicos
   */
  private checkAlignmentWithObjectives(content: string, strategy: any): boolean {
    // Se não temos estratégia definida, presumimos que está ok
    if (!strategy) return true;
    
    // Verifica se os objetivos estratégicos estão contemplados
    if (strategy.objectives && Array.isArray(strategy.objectives)) {
      const contentLower = content.toLowerCase();
      const missingObjectives = strategy.objectives.filter((objetivo: string) => 
        !contentLower.includes(objetivo.toLowerCase().substring(0, 15))
      );
      
      // Se algum objetivo central está faltando, há problema
      return missingObjectives.length === 0;
    }
    
    return true;
  }

  /**
   * Armazena o resultado da verificação no banco de dados
   */
  private async storeVerificationResult(
    caseId: string, 
    verificationResult: any,
    documentVerified: any
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
  
  /**
   * Determina se o documento passou na verificação
   */
  private documentPassedVerification(verificationResult: any): boolean {
    // Se todos os critérios forem aprovados, o documento passa
    return Object.values(verificationResult.criteria).every(Boolean);
    
    // Ou podemos usar uma lógica mais flexível que permite alguns problemas menores
    // Por exemplo:
    // const criticalCriteria = ['legalCompliance', 'alignmentWithObjectives'];
    // const criticalApproved = criticalCriteria.every(c => verificationResult.criteria[c]);
    // const minorIssues = Object.values(verificationResult.criteria).filter(v => !v).length;
    // return criticalApproved && minorIssues <= 1;
  }
}
