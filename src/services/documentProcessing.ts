
import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';
import { supabase } from '@/integrations/supabase/client';

// Configure PDF.js worker
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export interface DocumentContent {
  text: string;
  pages?: number;
  metadata?: Record<string, any>;
  error?: string;
}

export const DocumentProcessingService = {
  /**
   * Extract text from a document file
   */
  async extractText(file: File): Promise<DocumentContent> {
    try {
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        return await extractPdfText(file);
      } else if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.endsWith('.docx')
      ) {
        return await extractDocxText(file);
      } else {
        return {
          text: '',
          error: `Formato não suportado: ${file.type}`
        };
      }
    } catch (error: any) {
      console.error('Error extracting text:', error);
      return {
        text: '',
        error: `Erro ao processar documento: ${error.message}`
      };
    }
  },

  /**
   * Get a document by URL and extract its text
   */
  async extractTextFromUrl(url: string): Promise<DocumentContent> {
    try {
      // Fetch the file from the URL
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Create a File object from the blob
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
  },
  
  /**
   * Process a document for analysis by the agents
   */
  async processDocumentForAnalysis(filePath: string, caseId?: string): Promise<DocumentContent> {
    try {
      // Get the signed URL to access the file
      const { data: urlData, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600);

      if (urlError) throw urlError;

      // Extract text from the document
      const content = await this.extractTextFromUrl(urlData.signedUrl);
      
      // If document processing was successful, store the extracted text in the database
      if (content.text && caseId) {
        await this.storeDocumentContent(caseId, filePath, content);
      }
      
      return content;
    } catch (error: any) {
      console.error('Error processing document for analysis:', error);
      return {
        text: '',
        error: `Erro ao processar documento para análise: ${error.message}`
      };
    }
  },
  
  /**
   * Store document content in the database for later use
   */
  async storeDocumentContent(caseId: string, filePath: string, content: DocumentContent) {
    try {
      const { error } = await supabase
        .from('document_content')
        .insert({
          case_id: caseId,
          file_path: filePath,
          content: content.text,
          pages: content.pages,
          metadata: content.metadata,
          extracted_at: new Date().toISOString()
        });
        
      if (error) throw error;
    } catch (error) {
      console.error('Error storing document content:', error);
    }
  }
};

/**
 * Extract text from a PDF file
 */
async function extractPdfText(file: File): Promise<DocumentContent> {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjs.getDocument(new Uint8Array(arrayBuffer));
    const pdf = await loadingTask.promise;
    
    // Initialize text content variable
    let fullText = '';
    const numPages = pdf.numPages;
    
    // Extract text from each page
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      
      // Combine text items
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

/**
 * Extract text from a DOCX file
 */
async function extractDocxText(file: File): Promise<DocumentContent> {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Extract text using mammoth
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
