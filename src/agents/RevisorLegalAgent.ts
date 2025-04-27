
import { BaseAgent } from './base/BaseAgent';
import { AgentTask, AgentResult } from '@/types/agent';
import { DocumentVerifier } from './revisor-legal/documentVerifier';
import { VerificationService } from './revisor-legal/verificationService';
import { VerificationResult } from './revisor-legal/types';

export class RevisorLegalAgent extends BaseAgent {
  private verifier: DocumentVerifier;
  private service: VerificationService;

  constructor() {
    super(
      'revisor-legal',
      'Verificador de Conformidade',
      'Verifica requisitos formais, conformidade legal, citações, coerência lógica e alinhamento com objetivos'
    );
    this.verifier = new DocumentVerifier();
    this.service = new VerificationService();
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
      const documentToVerify = await this.service.getLatestDocument(caseId);
      if (!documentToVerify) {
        return {
          success: false,
          message: "Nenhum documento encontrado para verificação"
        };
      }

      // Obter a estratégia e objetivos do caso para verificação de alinhamento
      const strategyData = await this.service.getCaseStrategy(caseId);
      
      // Obter a análise de fatos para verificação de coerência
      const factsAnalysis = await this.service.getFactsAnalysis(caseId);

      // Realizar a verificação do documento
      const verificationResult = await this.verifyDocument(
        documentToVerify,
        strategyData,
        factsAnalysis
      );

      // Armazenar o resultado da verificação
      await this.service.storeVerificationResult(caseId, verificationResult, documentToVerify);

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

  private async verifyDocument(document: any, strategy: any, facts: any): Promise<VerificationResult> {
    const recommendations: string[] = [];
    const issuesFound: string[] = [];
    const content = document.content || '';
    const documentType = document.type || '';
    
    // Critérios de verificação
    const criteria = {
      formalRequirements: this.verifier.checkFormalRequirements(content, documentType),
      legalCompliance: this.verifier.checkLegalCompliance(content),
      citations: this.verifier.checkCitations(content),
      logicalCoherence: this.verifier.checkLogicalCoherence(content, facts),
      alignmentWithObjectives: this.verifier.checkAlignmentWithObjectives(content, strategy)
    };

    // Gerar recomendações baseadas nos critérios que falharam
    if (!criteria.formalRequirements) {
      issuesFound.push("Ausência de elementos formais obrigatórios");
      recommendations.push("Revisar estrutura formal do documento. Certifique-se que contém todas as seções necessárias.");
    }
    
    if (!criteria.legalCompliance) {
      issuesFound.push("Possíveis inconsistências na aplicação das leis");
      recommendations.push("Verificar se as referências legais estão atualizadas e são aplicáveis ao caso.");
    }
    
    if (!criteria.citations) {
      issuesFound.push("Citações ou referências incompletas/incorretas");
      recommendations.push("Revisar as citações legais e jurisprudenciais, assegurando-se de que estão completas e precisas.");
    }
    
    if (!criteria.logicalCoherence) {
      issuesFound.push("Possíveis inconsistências lógicas na argumentação");
      recommendations.push("Revisar a coerência entre os fatos apresentados e os argumentos desenvolvidos.");
    }
    
    if (!criteria.alignmentWithObjectives) {
      issuesFound.push("Desalinhamento com os objetivos estratégicos");
      recommendations.push("Revisar se o documento atende a todos os objetivos estratégicos definidos para o caso.");
    }
    
    if (issuesFound.length > 0) {
      recommendations.push("Considere revisar o documento com auxílio de um especialista antes da entrega final.");
    }
    
    return {
      criteria,
      recommendations,
      issuesFound
    };
  }

  private documentPassedVerification(verificationResult: VerificationResult): boolean {
    return Object.values(verificationResult.criteria).every(Boolean);
  }
}
