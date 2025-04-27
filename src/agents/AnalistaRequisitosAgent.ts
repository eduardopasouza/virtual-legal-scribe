
import { AgentTask, AgentResult } from '@/types/agent';
import { BaseAgent } from './base/BaseAgent';
import { DocumentMetadata } from '@/hooks/useDocuments';
import { supabase } from '@/integrations/supabase/client';
import { Case } from '@/types/case';

interface RequirementAnalysisResult {
  documentosAnalisados: number;
  documentosRequeridos: string[];
  documentosFaltantes: string[];
  requisitosIdentificados: number;
  problemasPotenciais: number;
  classificacaoCaso: string;
  documentacaoCompleta: boolean;
  informacoesAdicionaisNecessarias: string[];
  briefingInicial: {
    titulo: string;
    cliente: string;
    objetivo: string;
    tipoServico: string;
    documentosPrincipais: string[];
    pontosChave: string[];
    proximasEtapas: string[];
  };
}

export class AnalistaRequisitosAgent extends BaseAgent {
  private documentRequirementsByType: Record<string, string[]> = {
    // Casos cíveis
    'civil': ['Documentos pessoais', 'Procuração', 'Comprovante de residência'],
    'usucapiao': ['Documentos pessoais', 'Documentos do imóvel', 'Comprovante de posse', 'Certidão de matrícula'],
    'indenizatorio': ['Documentos pessoais', 'Comprovante do dano', 'Procuração', 'Comprovante de residência'],
    // Casos trabalhistas
    'trabalhista': ['Documentos pessoais', 'Carteira de trabalho', 'Contracheques', 'Contrato de trabalho'],
    // Casos penais
    'penal': ['Documentos pessoais', 'Boletim de ocorrência', 'Procuração'],
    // Recursos
    'recurso': ['Decisão recorrida', 'Procuração', 'Documentos pessoais'],
    'apelacao': ['Sentença', 'Procuração', 'Documentos pessoais'],
    // Contratos
    'contrato': ['Minutas contratuais', 'Documentos pessoais', 'Procuração']
  };

  constructor() {
    super(
      'analista-requisitos',
      'Analista de Requisitos',
      'Especialista em triagem inicial, classifica casos e gera briefing'
    );
  }

  async execute(task: AgentTask): Promise<AgentResult> {
    try {
      // Identificação do caso e documentos
      const caseId = task.caseId;
      if (!caseId) {
        return this.createErrorResult('ID do caso não fornecido');
      }

      // Buscar informações do caso
      const caseData = await this.getCaseData(caseId);
      if (!caseData) {
        return this.createErrorResult('Caso não encontrado');
      }

      // Buscar documentos associados ao caso
      const documents = await this.getDocuments(caseId);
      
      // Analisar requisitos do caso
      const analysisResult = await this.analyzeRequirements(caseData, documents);
      
      // Se houver documentos faltantes, criar alertas
      if (analysisResult.documentosFaltantes.length > 0 || 
          analysisResult.informacoesAdicionaisNecessarias.length > 0) {
        await this.createAlerts(caseId, analysisResult);
      }

      // Registrar o briefing como uma atividade
      await this.logBriefing(caseId, analysisResult);

      return {
        success: true,
        message: analysisResult.documentacaoCompleta 
          ? 'Análise de requisitos concluída com sucesso. Documentação completa.'
          : 'Análise de requisitos concluída. Foram identificadas pendências.',
        details: analysisResult
      };
    } catch (error) {
      console.error('Erro no AnalistaRequisitosAgent:', error);
      return {
        success: false,
        message: 'Ocorreu um erro durante a análise de requisitos',
        details: { error: String(error) }
      };
    }
  }

  private async getCaseData(caseId: string): Promise<Case | null> {
    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', caseId)
      .single();
      
    if (error) {
      console.error('Erro ao buscar dados do caso:', error);
      return null;
    }
    
    return data as Case;
  }

  private async getDocuments(caseId: string): Promise<DocumentMetadata[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('case_id', caseId);
      
    if (error) {
      console.error('Erro ao buscar documentos:', error);
      return [];
    }
    
    return data as DocumentMetadata[];
  }

  private async analyzeRequirements(
    caseData: Case, 
    documents: DocumentMetadata[]
  ): Promise<RequirementAnalysisResult> {
    // Identificar tipo de caso e determinar documentos necessários
    const caseType = this.identifyCaseType(caseData);
    const requiredDocuments = this.getRequiredDocuments(caseType, caseData);
    
    // Verificar documentos faltantes
    const documentTypes = documents.map(doc => this.categorizeDocument(doc));
    const missingDocuments = requiredDocuments.filter(req => !documentTypes.includes(req));
    
    // Verificar informações faltantes no caso
    const missingInformation = this.identifyMissingInformation(caseData);
    
    // Criar briefing inicial
    const briefing = this.createInitialBriefing(caseData, documents, caseType, missingDocuments, missingInformation);
    
    return {
      documentosAnalisados: documents.length,
      documentosRequeridos: requiredDocuments,
      documentosFaltantes: missingDocuments,
      requisitosIdentificados: requiredDocuments.length,
      problemasPotenciais: missingDocuments.length + missingInformation.length,
      classificacaoCaso: caseType,
      documentacaoCompleta: missingDocuments.length === 0 && missingInformation.length === 0,
      informacoesAdicionaisNecessarias: missingInformation,
      briefingInicial: briefing
    };
  }

  private identifyCaseType(caseData: Case): string {
    // Determinar tipo de caso com base na área de direito e outros dados
    const area = caseData.area_direito?.toLowerCase() || '';
    
    if (area.includes('civil')) {
      if (caseData.title?.toLowerCase().includes('usucapi')) return 'usucapiao';
      if (caseData.title?.toLowerCase().includes('indeniza')) return 'indenizatorio';
      return 'civil';
    }
    
    if (area.includes('trabalhista')) return 'trabalhista';
    if (area.includes('penal')) return 'penal';
    
    // Verificar se é recurso
    if (caseData.title?.toLowerCase().includes('recurso') || 
        caseData.title?.toLowerCase().includes('apelação')) {
      return 'recurso';
    }
    
    if (area.includes('empresarial') && 
        caseData.title?.toLowerCase().includes('contrato')) {
      return 'contrato';
    }
    
    // Default baseado na área de direito ou genérico
    return area || 'geral';
  }

  private getRequiredDocuments(caseType: string, caseData: Case): string[] {
    // Obter requisitos base pelo tipo de caso
    let requiredDocuments = this.documentRequirementsByType[caseType] || 
      this.documentRequirementsByType['civil'] || 
      ['Documentos pessoais', 'Procuração'];
      
    // Adicionar requisitos específicos baseado em outras características do caso
    if (caseData.title?.toLowerCase().includes('urgente') || 
        caseData.priority === 'urgente') {
      requiredDocuments = [...requiredDocuments, 'Justificativa de urgência'];
    }
    
    return requiredDocuments;
  }

  private categorizeDocument(document: DocumentMetadata): string {
    // Categorizar documento com base no nome e tipo
    const name = document.name.toLowerCase();
    
    if (name.includes('rg') || name.includes('cpf') || name.includes('identidade'))
      return 'Documentos pessoais';
      
    if (name.includes('procuracao') || name.includes('procuração'))
      return 'Procuração';
      
    if (name.includes('contrato'))
      return 'Contrato de trabalho';
      
    if (name.includes('comprovante') && name.includes('resid'))
      return 'Comprovante de residência';
      
    if (name.includes('matrícula') || name.includes('certidão') && name.includes('imóvel'))
      return 'Certidão de matrícula';
      
    if (name.includes('sentença') || name.includes('decisão'))
      return 'Decisão recorrida';
      
    if (name.includes('carteira') && name.includes('trabalho'))
      return 'Carteira de trabalho';
      
    if (name.includes('contracheque') || name.includes('holerite'))
      return 'Contracheques';
      
    if (name.includes('bo') || name.includes('boletim') || name.includes('ocorrência'))
      return 'Boletim de ocorrência';
      
    // Se não conseguir categorizar, usa o tipo genérico ou o próprio nome
    return document.type || name;
  }

  private identifyMissingInformation(caseData: Case): string[] {
    const missingInfo = [];
    
    // Verificar campos obrigatórios
    if (!caseData.client || caseData.client.trim() === '')
      missingInfo.push('Nome do cliente');
      
    if (!caseData.title || caseData.title.trim() === '')
      missingInfo.push('Título/descrição do caso');
      
    // Verificar campos importantes baseados no tipo/contexto
    if (caseData.area_direito === 'civil' || caseData.area_direito === 'empresarial') {
      if (!caseData.description || caseData.description.trim() === '')
        missingInfo.push('Descrição detalhada da situação');
    }
    
    if (caseData.area_direito === 'trabalhista') {
      if (!caseData.description || !caseData.description.includes('empregador'))
        missingInfo.push('Informações do empregador');
    }
    
    return missingInfo;
  }

  private createInitialBriefing(
    caseData: Case, 
    documents: DocumentMetadata[], 
    caseType: string,
    missingDocuments: string[],
    missingInformation: string[]
  ) {
    // Determinar objetivo com base nos dados disponíveis
    const objetivo = this.determineObjective(caseData, caseType);
    
    // Determinar documentos principais
    const documentosPrincipais = documents.slice(0, 3).map(d => d.name);
    
    // Pontos-chave baseados na análise
    const pontosChave = [];
    if (missingDocuments.length > 0) {
      pontosChave.push(`Documentação incompleta: faltam ${missingDocuments.join(', ')}`);
    }
    if (missingInformation.length > 0) {
      pontosChave.push(`Informações faltantes: ${missingInformation.join(', ')}`);
    }
    if (caseData.priority === 'urgente' || caseData.priority === 'alta') {
      pontosChave.push('Caso de alta prioridade - verificar prazos');
    }
    if (caseData.complexity === 'complexa' || caseData.complexity === 'muito_complexa') {
      pontosChave.push('Caso de alta complexidade - pode requerer especialistas adicionais');
    }
    if (pontosChave.length === 0) {
      pontosChave.push('Documentação e informações completas');
      pontosChave.push(`Caso de ${caseData.complexity || 'complexidade média'}`);
    }
    
    // Determinar próximas etapas
    const proximasEtapas = [];
    if (missingDocuments.length > 0 || missingInformation.length > 0) {
      proximasEtapas.push('Obter documentação/informações faltantes');
    }
    proximasEtapas.push('Análise estratégica do caso');
    proximasEtapas.push('Pesquisa jurídica aplicável');
    
    return {
      titulo: caseData.title,
      cliente: caseData.client,
      objetivo: objetivo,
      tipoServico: this.getCaseServiceType(caseType),
      documentosPrincipais: documentosPrincipais,
      pontosChave: pontosChave,
      proximasEtapas: proximasEtapas
    };
  }

  private determineObjective(caseData: Case, caseType: string): string {
    // Extrair objetivo a partir da descrição e tipo de caso
    if (caseData.description && caseData.description.length > 20) {
      // Se temos uma descrição detalhada, tentar extrair objetivo dela
      return caseData.description.substring(0, 150) + (caseData.description.length > 150 ? '...' : '');
    }
    
    // Caso contrário, usar template baseado no tipo de caso
    switch (caseType) {
      case 'usucapiao':
        return `Obter reconhecimento judicial do direito de propriedade por usucapião para ${caseData.client}`;
      case 'indenizatorio':
        return `Buscar reparação de danos para ${caseData.client}`;
      case 'trabalhista':
        return `Representar direitos trabalhistas de ${caseData.client}`;
      case 'recurso':
      case 'apelacao':
        return `Recorrer de decisão judicial desfavorável a ${caseData.client}`;
      case 'contrato':
        return `Elaborar/analisar contrato para ${caseData.client}`;
      default:
        return `Representar interesses jurídicos de ${caseData.client} em caso de ${caseData.area_direito || 'direito civil'}`;
    }
  }

  private getCaseServiceType(caseType: string): string {
    // Mapear tipo de caso para serviço jurídico correspondente
    const serviceMap: Record<string, string> = {
      'usucapiao': 'Ação de Usucapião',
      'indenizatorio': 'Ação de Indenização',
      'trabalhista': 'Reclamação Trabalhista',
      'penal': 'Defesa Criminal',
      'recurso': 'Recurso Judicial',
      'apelacao': 'Apelação',
      'contrato': 'Elaboração/Análise de Contrato',
      'civil': 'Ação Civil'
    };
    
    return serviceMap[caseType] || 'Consultoria Jurídica';
  }

  private async createAlerts(caseId: string, analysis: RequirementAnalysisResult) {
    // Criar alertas para documentos faltantes
    for (const doc of analysis.documentosFaltantes) {
      await supabase.from('alerts').insert({
        case_id: caseId,
        title: `Documento faltante: ${doc}`,
        description: `O documento "${doc}" é necessário para este tipo de caso e não foi encontrado.`,
        type: 'missing_document',
        priority: 'medium'
      });
    }
    
    // Criar alertas para informações faltantes
    for (const info of analysis.informacoesAdicionaisNecessarias) {
      await supabase.from('alerts').insert({
        case_id: caseId,
        title: `Informação faltante: ${info}`,
        description: `A informação "${info}" é necessária para prosseguir com o caso.`,
        type: 'missing_information',
        priority: 'medium'
      });
    }
  }

  private async logBriefing(caseId: string, analysis: RequirementAnalysisResult) {
    // Registrar briefing como atividade
    await supabase.from('activities').insert({
      case_id: caseId,
      agent: this.type,
      action: 'Análise de Requisitos',
      result: 'Briefing inicial gerado',
      details: JSON.stringify(analysis.briefingInicial)
    });
    
    // Se o caso já tem um objetivo definido na descrição, não precisamos atualizá-lo
    // Caso contrário, vamos adicionar o objetivo gerado como descrição do caso
    const { data } = await supabase
      .from('cases')
      .select('description')
      .eq('id', caseId)
      .single();
      
    if (!data?.description || data.description.trim() === '') {
      await supabase
        .from('cases')
        .update({
          description: analysis.briefingInicial.objetivo
        })
        .eq('id', caseId);
    }
  }

  private createErrorResult(message: string): AgentResult {
    return {
      success: false,
      message,
      details: {
        error: message
      }
    };
  }
}
