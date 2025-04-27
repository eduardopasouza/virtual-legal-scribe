
import { DocumentProcessingService } from '../documentProcessing';
import * as pdfjs from 'pdfjs-dist';

// Mock PDF.js
jest.mock('pdfjs-dist', () => ({
  getDocument: jest.fn(),
  GlobalWorkerOptions: {
    workerSrc: '',
  },
}));

describe('DocumentProcessingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('extractText()', () => {
    test('should reject unsupported file types', async () => {
      const file = new File(['content'], 'test.xyz', { type: 'application/xyz' });
      const result = await DocumentProcessingService.extractText(file);
      expect(result.text).toBe('');
      expect(result.error).toContain('Formato não suportado');
    });

    test('should handle PDF extraction errors', async () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      (pdfjs.getDocument as jest.Mock).mockRejectedValue(new Error('PDF error'));
      
      const result = await DocumentProcessingService.extractText(file);
      expect(result.text).toBe('');
      expect(result.error).toContain('Erro ao extrair texto do PDF');
    });

    test('should handle URL extraction errors', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      
      const result = await DocumentProcessingService.extractTextFromUrl('http://example.com/doc.pdf');
      expect(result.text).toBe('');
      expect(result.error).toContain('Erro ao processar documento da URL');
    });
  });
});
