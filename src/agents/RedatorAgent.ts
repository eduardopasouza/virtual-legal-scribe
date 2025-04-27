
import { AgentTask, AgentResult } from '@/types/agent';
import { BaseAgent } from './base/BaseAgent';
import { supabase } from '@/integrations/supabase/client';

interface DocumentStructure {
  tipo: string;
  secoes: string[];
  modelos?: Record<string, string>;
}

export class RedatorAgent extends BaseAgent {
  // Estruturas de documentos padrão por tipo
  private documentStructures: Record<string, DocumentStructure> = {
    'peticao-inicial': {
      tipo: 'Petição Inicial',
      secoes: [
        'cabecalho',
        'qualificacao',
        'fatos',
        'fundamentos',
        'pedidos',
        'conclusao'
      ]
    },
    'contestacao': {
      tipo: 'Contestação',
      secoes: [
        'cabecalho',
        'qualificacao',
        'preliminares',
        'fatos',
        'fundamentos',
        'pedidos',
        'conclusao'
      ]
    },
    'recurso': {
      tipo: 'Recurso',
      secoes: [
        'cabecalho',
        'qualificacao',
        'tempestividade',
        'sintese',
        'fundamentos',
        'pedidos',
        'conclusao'
      ]
    },
    'parecer': {
      tipo: 'Parecer Jurídico',
      secoes: [
        'cabecalho',
        'consulta',
        'fatos',
        'analise',
        'conclusao'
      ]
    }
  };

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

      // Tipo de documento a ser gerado (padrão: petição inicial)
      const documentType = metadata?.documentType || 'peticao-inicial';
      
      // Recuperar informações do caso para construir o documento
      const caseData = await this.getCaseData(caseId);
      
      // Recuperar análise de fatos se disponível
      const factsAnalysis = await this.getFactsAnalysis(caseId);
      
      // Recuperar estratégia do caso se disponível
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
      await this.storeDocument(caseId, document, documentType);

      return {
        success: true,
        message: `Documento ${this.documentStructures[documentType]?.tipo || documentType} redigido com sucesso`,
        details: {
          tipoDocumento: this.documentStructures[documentType]?.tipo || documentType,
          paginas: this.estimatePages(document.content),
          secoes: document.sections,
          palavrasTotal: this.countWords(document.content),
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

  /**
   * Recupera os dados do caso do banco de dados
   */
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
   * Recupera os dados de estratégia do caso
   */
  private async getStrategyData(caseId: string): Promise<any> {
    // Em uma implementação real, buscaria a estratégia na base de dados
    // Por enquanto, retornamos uma estratégia simulada
    return {
      mainThesis: 'Abordagem baseada na violação contratual com foco em restituição econômica',
      objectives: [
        'Demonstrar descumprimento dos termos contratuais',
        'Estabelecer nexo causal entre violação e danos'
      ]
    };
  }

  /**
   * Constrói o documento baseado no tipo, dados do caso e análises
   */
  private async buildDocument(
    documentType: string, 
    caseData: any, 
    factsAnalysis: any,
    strategyData: any,
    additionalInput?: string
  ): Promise<{ content: string, sections: string[] }> {
    // Verificar se temos estrutura para esse tipo de documento
    const structure = this.documentStructures[documentType] || this.documentStructures['peticao-inicial'];
    
    // Em uma implementação real, aqui teríamos chamadas para APIs de LLM
    // que construiriam cada seção do documento com base nas informações
    
    // Por enquanto, simulamos o conteúdo do documento seguindo a estrutura
    let content = "";
    const sections: string[] = [];
    
    // Cabeçalho
    if (structure.secoes.includes('cabecalho')) {
      sections.push('Cabeçalho');
      content += this.generateHeader(documentType, caseData);
    }
    
    // Qualificação
    if (structure.secoes.includes('qualificacao')) {
      sections.push('Qualificação das Partes');
      content += this.generateQualification(caseData);
    }
    
    // Fatos
    if (structure.secoes.includes('fatos')) {
      sections.push('Dos Fatos');
      content += this.generateFacts(factsAnalysis, caseData);
    }
    
    // Fundamentos
    if (structure.secoes.includes('fundamentos')) {
      sections.push('Do Direito');
      content += this.generateLegalBasis(strategyData, factsAnalysis);
    }
    
    // Pedidos
    if (structure.secoes.includes('pedidos')) {
      sections.push('Dos Pedidos');
      content += this.generateRequests(strategyData, documentType);
    }
    
    // Conclusão
    if (structure.secoes.includes('conclusao')) {
      sections.push('Conclusão');
      content += this.generateConclusion(documentType);
    }

    return { 
      content,
      sections
    };
  }
  
  /**
   * Gera o cabeçalho do documento
   */
  private generateHeader(documentType: string, caseData: any): string {
    return `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA VARA CÍVEL DA COMARCA DE ${caseData.court?.toUpperCase() || '[COMARCA]'}\n\n\n`;
  }
  
  /**
   * Gera a qualificação das partes
   */
  private generateQualification(caseData: any): string {
    let texto = "";
    
    // Em uma implementação real, estas informações viriam do banco de dados
    texto += `${caseData.client || '[NOME DO CLIENTE]'}, [qualificação completa], vem, respeitosamente, à presença de Vossa Excelência, por intermédio de seu advogado que esta subscreve, com fundamento no art. [artigos de lei aplicáveis], propor a presente\n\n`;
    texto += `AÇÃO [TIPO DE AÇÃO]\n\n`;
    texto += `em face de [NOME DO RÉU], [qualificação completa], pelos fatos e fundamentos a seguir expostos.\n\n`;
    
    return texto;
  }
  
  /**
   * Gera a seção de fatos com base na análise
   */
  private generateFacts(factsAnalysis: any, caseData: any): string {
    let texto = "I - DOS FATOS\n\n";
    
    if (factsAnalysis && factsAnalysis.cronologia && factsAnalysis.cronologia.length > 0) {
      factsAnalysis.cronologia.sort((a: any, b: any) => 
        new Date(a.data).getTime() - new Date(b.data).getTime()
      ).forEach((fato: any) => {
        texto += `Em ${fato.data}, ${fato.descricao}.\n\n`;
      });
      
      // Adicionar menção aos fatos incontroversos
      if (factsAnalysis.fatosIncontroversos && factsAnalysis.fatosIncontroversos.length > 0) {
        texto += "Importante destacar que são incontroversos os seguintes fatos: ";
        factsAnalysis.fatosIncontroversos.forEach((fato: string, index: number) => {
          texto += `${index > 0 ? '; ' : ''}${fato.toLowerCase()}`;
        });
        texto += ".\n\n";
      }
    } else {
      // Se não tiver análise de fatos, usar uma descrição genérica
      texto += `[Descrição dos fatos relevantes do caso ${caseData?.number || ''}]\n\n`;
    }
    
    return texto;
  }
  
  /**
   * Gera a fundamentação jurídica
   */
  private generateLegalBasis(strategyData: any, factsAnalysis: any): string {
    let texto = "II - DO DIREITO\n\n";
    
    // Usar a tese principal da estratégia
    if (strategyData && strategyData.mainThesis) {
      texto += `${strategyData.mainThesis}.\n\n`;
    }
    
    // Desenvolver argumentos com base nos objetivos estratégicos
    if (strategyData && strategyData.objectives) {
      strategyData.objectives.forEach((objetivo: string, index: number) => {
        texto += `${String.fromCharCode(97 + index)}) ${objetivo}\n\n`;
        
        // Simular desenvolvimento de cada argumento
        texto += `[Desenvolvimento do argumento sobre ${objetivo.toLowerCase()}]\n\n`;
        
        // Mencionar legislação aplicável
        texto += `Nesse sentido, o artigo [XXX] do [Código/Lei] estabelece que "[citação legal]".\n\n`;
        
        // Mencionar jurisprudência 
        texto += `A jurisprudência também caminha nesse sentido, conforme julgado do [Tribunal]: "[Ementa de jurisprudência]"\n\n`;
      });
    } else {
      texto += `[Fundamentação jurídica aplicável ao caso]\n\n`;
    }
    
    // Se houver fatos controversos, abordar especificamente
    if (factsAnalysis && factsAnalysis.fatosControversos && factsAnalysis.fatosControversos.length > 0) {
      texto += "Quanto aos pontos controversos, cabe esclarecer que:\n\n";
      
      factsAnalysis.fatosControversos.forEach((fato: string, index: number) => {
        texto += `${index + 1}. Quanto a ${fato.toLowerCase()}, [argumento jurídico específico];\n\n`;
      });
    }
    
    return texto;
  }
  
  /**
   * Gera os pedidos conforme o tipo de documento
   */
  private generateRequests(strategyData: any, documentType: string): string {
    let texto = "III - DOS PEDIDOS\n\n";
    
    texto += "Diante do exposto, requer a Vossa Excelência:\n\n";
    
    // Pedidos processuais padrão
    texto += "a) A citação do(a) Réu(Ré) para, querendo, apresentar contestação, sob pena de revelia;\n\n";
    
    // Pedidos baseados nos objetivos estratégicos
    if (strategyData && strategyData.objectives) {
      strategyData.objectives.forEach((objetivo: string, index: number) => {
        texto += `${String.fromCharCode(98 + index)}) [Pedido específico relacionado a "${objetivo}"];\n\n`;
      });
    } else {
      texto += "b) [Pedido principal];\n\n";
      texto += "c) [Pedidos secundários];\n\n";
    }
    
    // Pedidos finais padrão
    texto += "d) A condenação da parte contrária ao pagamento das custas processuais e honorários advocatícios;\n\n";
    texto += "e) A produção de todas as provas em direito admitidas.\n\n";
    
    return texto;
  }
  
  /**
   * Gera a conclusão do documento
   */
  private generateConclusion(documentType: string): string {
    let texto = "";
    
    if (['peticao-inicial', 'contestacao', 'recurso'].includes(documentType)) {
      texto += "Dá-se à causa o valor de R$ [valor da causa].\n\n";
      texto += "Nestes termos,\nPede deferimento.\n\n";
      texto += "[Local], [data].\n\n\n";
      texto += "[Nome do Advogado]\nOAB/[Estado] [número]\n\n";
    } else if (documentType === 'parecer') {
      texto += "É o parecer.\n\n";
      texto += "[Local], [data].\n\n\n";
      texto += "[Nome do Consultor Jurídico]\nOAB/[Estado] [número]\n\n";
    }
    
    return texto;
  }
  
  /**
   * Armazena o documento gerado no banco de dados
   */
  private async storeDocument(caseId: string, document: { content: string, sections: string[] }, documentType: string): Promise<void> {
    const { error } = await supabase
      .from('activities')
      .insert({
        case_id: caseId,
        agent: 'redator',
        action: `Redação de ${this.documentStructures[documentType]?.tipo || documentType}`,
        result: JSON.stringify({
          content: document.content,
          sections: document.sections,
          type: documentType
        })
      });
      
    if (error) throw new Error(`Erro ao salvar documento: ${error.message}`);
  }
  
  /**
   * Estima o número de páginas com base no conteúdo
   */
  private estimatePages(content: string): number {
    // Estimativa aproximada: 3000 caracteres por página (incluindo espaços)
    const charactersPerPage = 3000;
    return Math.max(1, Math.ceil(content.length / charactersPerPage));
  }
  
  /**
   * Conta o número de palavras no texto
   */
  private countWords(content: string): number {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  }
}
