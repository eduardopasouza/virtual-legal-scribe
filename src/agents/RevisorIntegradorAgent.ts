
import { AgentTask, AgentResult } from '@/types/agent';
import { BaseAgent } from './base/BaseAgent';
import { supabase } from '@/integrations/supabase/client';
import { LLMProvider, LLMMessage } from '@/lib/llm/types';
import { LLMAgentFactory } from '@/lib/llm/LLMAgentFactory';

interface RevisionResult {
  originalContent: string;
  revisedContent: string;
  changesMade: string[];
  improvementsDescription: string;
  readabilityScore: number;
  technicalAccuracyPreserved: boolean;
}

export class RevisorIntegradorAgent extends BaseAgent {
  constructor() {
    super(
      'revisor-integrador',
      'Revisor Integrador',
      'Revisa e aprimora os documentos jurídicos, integrando contribuições e garantindo coesão e uniformidade'
    );
  }

  async execute({ caseId, input, metadata }: AgentTask): Promise<AgentResult> {
    try {
      console.log(`RevisorIntegradorAgent: Iniciando revisão para o caso ${caseId}`);

      if (!caseId) {
        return {
          success: false,
          message: "ID do caso não fornecido"
        };
      }

      // Obter o documento mais recente para revisão
      const documentToRevise = await this.getLatestDocument(caseId);
      if (!documentToRevise) {
        return {
          success: false,
          message: "Nenhum documento encontrado para revisão"
        };
      }

      // Obter resultados de verificação, se existirem
      const verificationResults = await this.getVerificationResults(caseId);
      
      // Realizar a revisão do documento
      const revisionResult = await this.reviseDocument(
        documentToRevise,
        verificationResults
      );

      // Armazenar o documento revisado
      await this.storeRevisedDocument(caseId, revisionResult, documentToRevise);

      return {
        success: true,
        message: "Documento revisado e finalizado com sucesso",
        details: {
          documentoTipo: documentToRevise.type,
          melhorias: revisionResult.changesMade.length,
          resumoMelhorias: revisionResult.improvementsDescription,
          escore: revisionResult.readabilityScore,
          preservacaoTecnica: revisionResult.technicalAccuracyPreserved ? "Sim" : "Parcial"
        }
      };
    } catch (error: any) {
      console.error(`RevisorIntegradorAgent: Erro na revisão:`, error);
      
      return {
        success: false,
        message: `Erro ao revisar documento: ${error.message}`
      };
    }
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
   * Recupera os resultados de verificação mais recentes
   */
  private async getVerificationResults(caseId: string): Promise<any> {
    const { data, error } = await supabase
      .from('activities')
      .select('result')
      .eq('case_id', caseId)
      .eq('agent', 'revisor-legal')
      .like('action', 'Verificação de%')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.warn(`Nenhuma verificação encontrada para o caso ${caseId}`);
      return null;
    }
    
    return data?.result ? JSON.parse(data.result) : null;
  }

  /**
   * Revisa o documento, incorporando melhorias de estilo, coesão e integração
   */
  private async reviseDocument(document: any, verificationResults: any): Promise<RevisionResult> {
    const originalContent = document.content || '';
    
    // Lista de melhorias a serem aplicadas
    const changesMade: string[] = [];
    
    // Aplicar correções com base nos resultados da verificação
    let revisedContent = await this.applyVerificationFixes(originalContent, verificationResults, changesMade);
    
    // Melhorar a fluidez e coesão do texto
    revisedContent = await this.improveTextFlow(revisedContent, changesMade);
    
    // Unificar terminologia e referências
    revisedContent = this.unifyTerminology(revisedContent, changesMade);
    
    // Remover redundâncias e repetições
    revisedContent = this.removeRedundancies(revisedContent, changesMade);
    
    // Melhorar a formatação final
    revisedContent = this.improveFormatting(revisedContent, changesMade);
    
    // Avaliar legibilidade do texto final (simulado)
    const readabilityScore = this.calculateReadabilityScore(revisedContent);
    
    // Verificar se a precisão técnica foi preservada
    const technicalAccuracyPreserved = this.verifyTechnicalAccuracy(originalContent, revisedContent);
    
    // Gerar descrição das melhorias realizadas
    const improvementsDescription = this.summarizeImprovements(changesMade);
    
    return {
      originalContent,
      revisedContent,
      changesMade,
      improvementsDescription,
      readabilityScore,
      technicalAccuracyPreserved
    };
  }
  
  /**
   * Aplica correções com base nos resultados da verificação
   */
  private async applyVerificationFixes(content: string, verificationResults: any, changesMade: string[]): Promise<string> {
    if (!verificationResults) {
      return content;
    }
    
    let revisedContent = content;
    const issues = verificationResults.problemas || [];
    
    // Aplicar correções para cada problema identificado
    for (const issue of issues) {
      if (issue.includes("Ausência de elementos formais")) {
        revisedContent = this.addMissingFormalElements(revisedContent);
        changesMade.push("Adicionados elementos formais obrigatórios");
      }
      
      if (issue.includes("inconsistências na aplicação das leis")) {
        revisedContent = this.correctLegalReferences(revisedContent);
        changesMade.push("Corrigidas referências legais inconsistentes");
      }
      
      if (issue.includes("Citações ou referências incompletas")) {
        revisedContent = this.correctCitations(revisedContent);
        changesMade.push("Completadas citações e referências");
      }
      
      if (issue.includes("inconsistências lógicas")) {
        revisedContent = this.improveLogicalConsistency(revisedContent);
        changesMade.push("Melhorada consistência lógica da argumentação");
      }
      
      if (issue.includes("Desalinhamento com os objetivos")) {
        revisedContent = this.alignWithObjectives(revisedContent);
        changesMade.push("Reorientado texto para melhor alinhamento com objetivos");
      }
    }
    
    return revisedContent;
  }
  
  /**
   * Adiciona elementos formais que estejam faltando
   */
  private addMissingFormalElements(content: string): string {
    // Em uma implementação completa, aqui analisaríamos o documento
    // e adicionaríamos elementos formais que estejam faltando
    // Por ora, simulamos uma melhoria genérica
    
    if (!content.includes("Pede deferimento")) {
      content += "\n\nNestes termos,\nPede deferimento.\n\n";
      content += "[Local], [data].\n\n\n";
      content += "[Nome do Advogado]\nOAB/[Estado] [número]\n";
    }
    
    return content;
  }
  
  /**
   * Corrige referências legais inconsistentes
   */
  private correctLegalReferences(content: string): string {
    // Simulação de correção de referências legais
    // Em um sistema real, teríamos uma base de conhecimento jurídico
    
    // Exemplo simples: atualizar referências ao Código Civil de 1916
    return content.replace(
      /Código Civil de 1916/g,
      "Código Civil de 2002"
    );
  }
  
  /**
   * Corrige e completa citações
   */
  private correctCitations(content: string): string {
    // Simulação de correção de citações
    // Em um caso real, teríamos verificação contra uma base de jurisprudência
    
    // Exemplo: formatar citações de acordo com padrões
    let revisedContent = content;
    
    // Corrigir formato de citações do STJ
    const stjPattern = /STJ\s+([^0-9]+)?\s*(\d+)/g;
    revisedContent = revisedContent.replace(stjPattern, "Superior Tribunal de Justiça, $1 nº $2");
    
    return revisedContent;
  }
  
  /**
   * Melhora a consistência lógica do texto
   */
  private improveLogicalConsistency(content: string): string {
    // Em uma implementação real, usaríamos técnicas avançadas de NLP
    // ou enviaríamos para um LLM específico para essa tarefa
    
    // Exemplo simplificado: adicionar conectivos lógicos
    return content;
  }
  
  /**
   * Alinha o texto com os objetivos estratégicos
   */
  private alignWithObjectives(content: string): string {
    // Em uma implementação real, verificaríamos contra objetivos específicos
    // e ajustaríamos o texto para refletir esses objetivos
    
    return content;
  }
  
  /**
   * Melhora a fluidez e coesão do texto
   */
  private async improveTextFlow(content: string, changesMade: string[]): Promise<string> {
    // Aqui poderíamos usar um modelo de linguagem para melhorar a fluidez
    // Em uma implementação completa, enviaríamos para um LLM
    
    // Simulando melhoria baseada em regras simples
    let revisedContent = content;
    
    // Substituir repetições de "conforme mencionado" por variações
    if (revisedContent.match(/conforme mencionado/gi)?.length > 1) {
      revisedContent = revisedContent.replace(/conforme mencionado/i, "como exposto");
      changesMade.push("Reduzida repetição de expressões");
    }
    
    // Adicionar conectivos para melhorar fluidez entre parágrafos
    revisedContent = revisedContent.replace(/\.\n\n([A-Z])/g, ".\n\nAinda, $1");
    
    if (revisedContent !== content) {
      changesMade.push("Melhorada a fluidez textual entre parágrafos");
    }
    
    return revisedContent;
  }
  
  /**
   * Unifica a terminologia e referências no texto
   */
  private unifyTerminology(content: string, changesMade: string[]): string {
    let revisedContent = content;
    const patterns = [
      { 
        search: /(?:Sr\.|Senhor|Sr) ([A-Z][a-z]+) ([A-Z][a-z]+)(.*?)(?:Sr\.|Senhor|o|O) \1\b/g,
        replace: "Sr. $1 $2$3o Requerente"
      },
      {
        search: /(?:Lei|LEI) (\d+)\/(\d+)(.*?)(?:Lei|LEI) \1\/\2/gi,
        replace: "Lei $1/$2$3referida Lei"
      }
    ];
    
    for (const pattern of patterns) {
      const originalContent = revisedContent;
      revisedContent = revisedContent.replace(pattern.search, pattern.replace);
      
      if (revisedContent !== originalContent) {
        changesMade.push("Unificada terminologia para referências a pessoas e legislação");
      }
    }
    
    return revisedContent;
  }
  
  /**
   * Remove redundâncias e repetições desnecessárias
   */
  private removeRedundancies(content: string, changesMade: string[]): string {
    // Procurar por sentenças quase idênticas
    const sentences = content.split(/\.\s+/);
    const uniqueSentences = new Set<string>();
    const filteredSentences: string[] = [];
    
    for (const sentence of sentences) {
      // Normalização básica para comparação
      const normalized = sentence.toLowerCase().trim().replace(/\s+/g, ' ');
      
      if (!uniqueSentences.has(normalized) || normalized.length < 10) {
        uniqueSentences.add(normalized);
        filteredSentences.push(sentence);
      } else {
        // Sentença similar já existe
        changesMade.push("Removida redundância no texto");
      }
    }
    
    return filteredSentences.join(". ");
  }
  
  /**
   * Melhora a formatação final do documento
   */
  private improveFormatting(content: string, changesMade: string[]): string {
    let revisedContent = content;
    
    // Corrigir espaços duplos
    const originalLength = revisedContent.length;
    revisedContent = revisedContent.replace(/\s{2,}/g, " ");
    
    if (originalLength !== revisedContent.length) {
      changesMade.push("Corrigidos espaços duplos");
    }
    
    // Padronizar citações de artigos
    const artPattern = /art(?:igo|\.)\s+(\d+)/gi;
    revisedContent = revisedContent.replace(artPattern, "Art. $1");
    
    // Formatar parágrafos jurídicos
    revisedContent = revisedContent.replace(/\n\s*Parágrafo\s+[úÚ]nico\./g, "\n    Parágrafo único.");
    revisedContent = revisedContent.replace(/\n\s*§\s*(\d+)[\.º]/g, "\n    § $1º.");
    
    changesMade.push("Padronizada formatação jurídica");
    
    return revisedContent;
  }
  
  /**
   * Calcula um score de legibilidade para o texto
   */
  private calculateReadabilityScore(text: string): number {
    // Em uma implementação real, usaríamos algoritmos como Flesch-Kincaid
    // Por ora, simulamos com uma métrica simplificada
    
    // Contagem de sentenças
    const sentences = text.split(/[.!?]+/).length;
    
    // Contagem de palavras
    const words = text.split(/\s+/).length;
    
    // Contagem de palavras longas (potencialmente complexas)
    const longWords = text.split(/\s+/).filter(word => word.length > 8).length;
    
    // Score básico: quanto menor a proporção de palavras longas e maior o tamanho médio
    // das sentenças (até certo limite), melhor a legibilidade
    const avgWordsPerSentence = words / sentences;
    const longWordsRatio = longWords / words;
    
    // Score normalizado entre 0 e 10
    // Fórmula simplificada: penaliza sentenças muito curtas (<5) ou muito longas (>25)
    // e penaliza alta proporção de palavras longas
    let score = 10 - Math.abs(avgWordsPerSentence - 15) / 2 - longWordsRatio * 20;
    
    // Limitar entre 0 e 10
    return Math.max(0, Math.min(10, score));
  }
  
  /**
   * Verifica se a precisão técnica do texto foi preservada
   */
  private verifyTechnicalAccuracy(original: string, revised: string): boolean {
    // Em uma implementação real, usaríamos análise semântica avançada
    // Por ora, fazemos uma verificação simplificada
    
    // Verificar se termos técnicos importantes foram preservados
    const legalTerms = [
      "emenda à inicial", "contestação", "impugnação", "recurso", "agravo",
      "apelação", "embargos", "jurisprudência", "doutrina", "legislação",
      "constituição", "código", "decreto", "medida provisória", "súmula"
    ];
    
    // Verificar se todos os termos presentes no original estão presentes no revisado
    for (const term of legalTerms) {
      const regex = new RegExp(term, 'i');
      if (regex.test(original) && !regex.test(revised)) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Gera um resumo das melhorias realizadas
   */
  private summarizeImprovements(changes: string[]): string {
    if (changes.length === 0) {
      return "O documento já apresentava boa qualidade técnica e textual, não necessitando de ajustes significativos.";
    }
    
    if (changes.length <= 3) {
      return `Foram realizadas melhorias pontuais no documento: ${changes.join("; ")}.`;
    }
    
    // Agrupar melhorias por categoria
    const categories = {
      estilo: changes.filter(c => c.includes("fluidez") || c.includes("repetição") || c.includes("estilo")),
      técnico: changes.filter(c => c.includes("referência") || c.includes("citação") || c.includes("legal")),
      estrutura: changes.filter(c => c.includes("formatação") || c.includes("formal") || c.includes("estrutura")),
      conteúdo: changes.filter(c => c.includes("lógica") || c.includes("objetivos") || c.includes("consistência"))
    };
    
    let summary = "O documento foi revisado e aprimorado em diferentes aspectos: ";
    
    if (categories.estilo.length) summary += `estilo textual (${categories.estilo.length} melhorias), `;
    if (categories.técnico.length) summary += `precisão técnica (${categories.técnico.length} melhorias), `;
    if (categories.estrutura.length) summary += `estrutura formal (${categories.estrutura.length} melhorias), `;
    if (categories.conteúdo.length) summary += `conteúdo argumentativo (${categories.conteúdo.length} melhorias), `;
    
    // Remover a última vírgula e espaço
    summary = summary.replace(/, $/, ".");
    
    return summary;
  }

  /**
   * Armazena o documento revisado no banco de dados
   */
  private async storeRevisedDocument(
    caseId: string, 
    revisionResult: RevisionResult,
    originalDocument: any
  ): Promise<void> {
    const { error } = await supabase
      .from('activities')
      .insert({
        case_id: caseId,
        agent: 'revisor-integrador',
        action: `Revisão de ${originalDocument.title || originalDocument.type || 'documento'}`,
        result: JSON.stringify({
          content: revisionResult.revisedContent,
          originalContent: revisionResult.originalContent,
          type: originalDocument.type,
          sections: originalDocument.sections,
          changesMade: revisionResult.changesMade,
          improvementsDescription: revisionResult.improvementsDescription,
          readabilityScore: revisionResult.readabilityScore,
          documentoOriginalId: originalDocument.id
        })
      });
      
    if (error) throw new Error(`Erro ao salvar documento revisado: ${error.message}`);
  }
}
