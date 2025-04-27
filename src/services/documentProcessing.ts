
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
import { DocumentContent } from '@/types/document';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const DocumentProcessingService = {
  async extractText(file: File): Promise<DocumentContent> {
    try {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        return await extractPdfText(file);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.endsWith('.docx')
      ) {
        return await extractDocxText(file);
      }
      return {
        text: '',
        error: `Formato não suportado: ${file.type}`
      };
    } catch (error: any) {
      console.error('Error extracting text:', error);
      return {
        text: '',
        error: `Erro ao processar documento: ${error.message}`
      };
    }
  },

  async extractTextFromUrl(url: string): Promise<DocumentContent> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const fileName = url.split('/').pop() || 'document';
      const file = new File([blob], fileName, { type: blob.type });
      return this.extractText(file);
    } catch (error: any) {
      console.error('Error extracting text from URL:', error);
      return {
        text: '',
        error: `Erro ao processar documento da URL: ${error.message}`
      };
    }
  }
};

async function extractPdfText(file: File): Promise<DocumentContent> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument(new Uint8Array(arrayBuffer));
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    const numPages = pdf.numPages;
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map(item => ('str' in item) ? item.str : '')
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    return {
      text: fullText.trim(),
      pages: numPages,
      metadata: {
        format: 'PDF'
      }
    };
  } catch (error: any) {
    console.error('Error extracting PDF text:', error);
    return {
      text: '',
      error: `Erro ao extrair texto do PDF: ${error.message}`
    };
  }
}

async function extractDocxText(file: File): Promise<DocumentContent> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return {
      text: result.value,
      metadata: {
        format: 'DOCX',
        messages: result.messages
      }
    };
  } catch (error: any) {
    console.error('Error extracting DOCX text:', error);
    return {
      text: '',
      error: `Erro ao extrair texto do DOCX: ${error.message}`
    };
  }
}
