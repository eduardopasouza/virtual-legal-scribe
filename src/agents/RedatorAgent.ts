
import { AgentTask, AgentResult } from '@/types/agent';
import { BaseAgent } from './base/BaseAgent';
import { DocumentGenerator } from './redator/documentGenerator';
import { documentStructures } from './redator/documentStructures';
import { GeneratedDocument } from './redator/types';

export class RedatorAgent extends BaseAgent {
  constructor() {
    super(
      'redator',
      'Redator Jurídico',
      'Elabora rascunhos de peças jurídicas completas, aplicando modelos e formatação adequada'
    );
  }

  async execute({ caseId, input, metadata }: AgentTask): Promise<AgentResult> {
    try {
      console.log(`RedatorAgent: Iniciando redação para o caso ${caseId}`);

      if (!caseId) {
        return {
          success: false,
          message: "ID do caso não fornecido"
        };
      }

      const documentType = metadata?.documentType || 'peticao-inicial';
      
      // Recuperar informações do caso para construir o documento
      const caseData = await this.getCaseData(caseId);
      const factsAnalysis = await this.getFactsAnalysis(caseId);
      const strategyData = await this.getStrategyData(caseId);

      // Construir o documento com base nas informações obtidas
      const document = await this.buildDocument(
        documentType, 
        caseData, 
        factsAnalysis,
        strategyData,
        input
      );

      // Armazenar o documento gerado
      await DocumentGenerator.storeDocument(caseId, document, documentType);

      return {
        success: true,
        message: `Documento ${documentStructures[documentType]?.tipo || documentType} redigido com sucesso`,
        details: {
          tipoDocumento: documentStructures[documentType]?.tipo || documentType,
          paginas: DocumentGenerator.estimatePages(document.content),
          secoes: document.sections,
          palavrasTotal: DocumentGenerator.countWords(document.content),
          conteudo: document.content
        }
      };
    } catch (error: any) {
      console.error(`RedatorAgent: Erro na redação:`, error);
      return {
        success: false,
        message: `Erro ao redigir documento: ${error.message}`
      };
    }
  }

  private async getCaseData(caseId: string): Promise<any> {
    const { data: caseData, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', caseId)
      .single();

    if (error) throw new Error(`Erro ao recuperar dados do caso: ${error.message}`);
    if (!caseData) throw new Error('Caso não encontrado');
    
    return caseData;
  }

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

  private async getStrategyData(caseId: string): Promise<any> {
    return {
      mainThesis: 'Abordagem baseada na violação contratual com foco em restituição econômica',
      objectives: [
        'Demonstrar descumprimento dos termos contratuais',
        'Estabelecer nexo causal entre violação e danos'
      ]
    };
  }

  private async buildDocument(
    documentType: string, 
    caseData: any, 
    factsAnalysis: any,
    strategyData: any,
    additionalInput?: string
  ): Promise<GeneratedDocument> {
    const structure = documentStructures[documentType] || documentStructures['peticao-inicial'];
    let content = "";
    const sections: string[] = [];
    
    // Gerar cada seção do documento
    if (structure.secoes.includes('cabecalho')) {
      content += DocumentGenerator.generateHeader(documentType, caseData);
      sections.push('Cabeçalho');
    }
    
    if (structure.secoes.includes('qualificacao')) {
      sections.push('Qualificação das Partes');
      content += DocumentGenerator.generateQualification(caseData);
    }
    
    if (structure.secoes.includes('fatos')) {
      sections.push('Dos Fatos');
      content += DocumentGenerator.generateFacts(factsAnalysis, caseData);
    }
    
    if (structure.secoes.includes('fundamentos')) {
      sections.push('Do Direito');
      content += DocumentGenerator.generateLegalBasis(strategyData, factsAnalysis);
    }
    
    if (structure.secoes.includes('pedidos')) {
      sections.push('Dos Pedidos');
      content += DocumentGenerator.generateRequests(strategyData, documentType);
    }
    
    if (structure.secoes.includes('conclusao')) {
      sections.push('Conclusão');
      content += DocumentGenerator.generateConclusion(documentType);
    }

    return { 
      content,
      sections
    };
  }
}
