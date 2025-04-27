
import { DocumentToVerify, VerificationCriteria } from './types';

export class DocumentVerifier {
  checkFormalRequirements(content: string, documentType: string): boolean {
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

  checkLegalCompliance(content: string): boolean {
    const hasLegalReferences = /art(\.|igo)\s+\d+|lei\s+\d+/i.test(content);
    const hasObviousErrors = content.toLowerCase().includes('código civil de 1916') && 
                           !content.toLowerCase().includes('histórico') &&
                           !content.toLowerCase().includes('revogado');
    
    return hasLegalReferences && !hasObviousErrors;
  }

  checkCitations(content: string): boolean {
    const hasCitations = /STF|STJ|TJ|TRF/i.test(content);
    
    if (hasCitations) {
      return /STF|STJ|TRF|TJ[\w-]*\s+(RE|HC|MS|ADI|REsp|AC|AG)[\s.]+\d+/i.test(content);
    }
    
    return true;
  }

  checkLogicalCoherence(content: string, facts: any): boolean {
    if (!facts) return true;
    
    if (facts.fatosRelevantes && Array.isArray(facts.fatosRelevantes)) {
      const contentLower = content.toLowerCase();
      const missingFacts = facts.fatosRelevantes.filter((fato: string) => 
        !contentLower.includes(fato.toLowerCase().substring(0, 20))
      );
      
      return missingFacts.length <= 0.3 * facts.fatosRelevantes.length;
    }
    
    return true;
  }

  checkAlignmentWithObjectives(content: string, strategy: any): boolean {
    if (!strategy) return true;
    
    if (strategy.objectives && Array.isArray(strategy.objectives)) {
      const contentLower = content.toLowerCase();
      const missingObjectives = strategy.objectives.filter((objetivo: string) => 
        !contentLower.includes(objetivo.toLowerCase().substring(0, 15))
      );
      
      return missingObjectives.length === 0;
    }
    
    return true;
  }
}
