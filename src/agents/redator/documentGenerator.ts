
import { supabase } from '@/integrations/supabase/client';
import { DocumentData, GeneratedDocument } from './types';
import { documentStructures } from './documentStructures';

export class DocumentGenerator {
  static generateHeader(documentType: string, caseData: DocumentData): string {
    return `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA VARA CÍVEL DA COMARCA DE ${caseData.court?.toUpperCase() || '[COMARCA]'}\n\n\n`;
  }

  static generateQualification(caseData: DocumentData): string {
    let texto = "";
    texto += `${caseData.client || '[NOME DO CLIENTE]'}, [qualificação completa], vem, respeitosamente, à presença de Vossa Excelência, por intermédio de seu advogado que esta subscreve, com fundamento no art. [artigos de lei aplicáveis], propor a presente\n\n`;
    texto += `AÇÃO [TIPO DE AÇÃO]\n\n`;
    texto += `em face de [NOME DO RÉU], [qualificação completa], pelos fatos e fundamentos a seguir expostos.\n\n`;
    return texto;
  }

  static generateFacts(factsAnalysis: any, caseData: DocumentData): string {
    let texto = "I - DOS FATOS\n\n";
    
    if (factsAnalysis?.cronologia && factsAnalysis.cronologia.length > 0) {
      factsAnalysis.cronologia
        .sort((a: any, b: any) => new Date(a.data).getTime() - new Date(b.data).getTime())
        .forEach((fato: any) => {
          texto += `Em ${fato.data}, ${fato.descricao}.\n\n`;
        });
      
      if (factsAnalysis.fatosIncontroversos?.length > 0) {
        texto += "Importante destacar que são incontroversos os seguintes fatos: ";
        factsAnalysis.fatosIncontroversos.forEach((fato: string, index: number) => {
          texto += `${index > 0 ? '; ' : ''}${fato.toLowerCase()}`;
        });
        texto += ".\n\n";
      }
    } else {
      texto += `[Descrição dos fatos relevantes do caso ${caseData?.number || ''}]\n\n`;
    }
    
    return texto;
  }

  static generateLegalBasis(strategyData: any, factsAnalysis: any): string {
    let texto = "II - DO DIREITO\n\n";
    
    if (strategyData?.mainThesis) {
      texto += `${strategyData.mainThesis}.\n\n`;
    }
    
    if (strategyData?.objectives) {
      strategyData.objectives.forEach((objetivo: string, index: number) => {
        texto += `${String.fromCharCode(97 + index)}) ${objetivo}\n\n`;
        texto += `[Desenvolvimento do argumento sobre ${objetivo.toLowerCase()}]\n\n`;
        texto += `Nesse sentido, o artigo [XXX] do [Código/Lei] estabelece que "[citação legal]".\n\n`;
        texto += `A jurisprudência também caminha nesse sentido, conforme julgado do [Tribunal]: "[Ementa de jurisprudência]"\n\n`;
      });
    } else {
      texto += `[Fundamentação jurídica aplicável ao caso]\n\n`;
    }
    
    if (factsAnalysis?.fatosControversos?.length > 0) {
      texto += "Quanto aos pontos controversos, cabe esclarecer que:\n\n";
      factsAnalysis.fatosControversos.forEach((fato: string, index: number) => {
        texto += `${index + 1}. Quanto a ${fato.toLowerCase()}, [argumento jurídico específico];\n\n`;
      });
    }
    
    return texto;
  }

  static generateRequests(strategyData: any, documentType: string): string {
    let texto = "III - DOS PEDIDOS\n\n";
    texto += "Diante do exposto, requer a Vossa Excelência:\n\n";
    texto += "a) A citação do(a) Réu(Ré) para, querendo, apresentar contestação, sob pena de revelia;\n\n";
    
    if (strategyData?.objectives) {
      strategyData.objectives.forEach((objetivo: string, index: number) => {
        texto += `${String.fromCharCode(98 + index)}) [Pedido específico relacionado a "${objetivo}"];\n\n`;
      });
    } else {
      texto += "b) [Pedido principal];\n\n";
      texto += "c) [Pedidos secundários];\n\n";
    }
    
    texto += "d) A condenação da parte contrária ao pagamento das custas processuais e honorários advocatícios;\n\n";
    texto += "e) A produção de todas as provas em direito admitidas.\n\n";
    
    return texto;
  }

  static generateConclusion(documentType: string): string {
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

  static async storeDocument(caseId: string, document: GeneratedDocument, documentType: string): Promise<void> {
    const { error } = await supabase
      .from('activities')
      .insert({
        case_id: caseId,
        agent: 'redator',
        action: `Redação de ${documentStructures[documentType]?.tipo || documentType}`,
        result: JSON.stringify({
          content: document.content,
          sections: document.sections,
          type: documentType
        })
      });
      
    if (error) throw new Error(`Erro ao salvar documento: ${error.message}`);
  }

  static estimatePages(content: string): number {
    const charactersPerPage = 3000;
    return Math.max(1, Math.ceil(content.length / charactersPerPage));
  }

  static countWords(content: string): number {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  }
}
