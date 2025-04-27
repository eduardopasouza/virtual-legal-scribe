
import { renderHook, act } from '@testing-library/react';
import { useFileUpload } from '../useFileUpload';
import { DocumentProcessingService } from '@/services/documentProcessing';

// Mock DocumentProcessingService
jest.mock('@/services/documentProcessing', () => ({
  DocumentProcessingService: {
    extractText: jest.fn(),
  },
}));

describe('useFileUpload', () => {
  const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useFileUpload({
      onSuccess: mockOnSuccess
    }));

    expect(result.current.selectedFile).toBeNull();
    expect(result.current.uploadStatus).toBe('idle');
    expect(result.current.errorMessage).toBeNull();
  });

  test('should handle file selection', () => {
    const { result } = renderHook(() => useFileUpload({
      onSuccess: mockOnSuccess
    }));

    act(() => {
      result.current.handleFileSelection(mockFile);
    });

    expect(result.current.selectedFile).toBe(mockFile);
    expect(result.current.uploadStatus).toBe('idle');
  });

  test('should reject files larger than 10MB', () => {
    const largeMockFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', {
      type: 'application/pdf',
    });

    const { result } = renderHook(() => useFileUpload({
      onSuccess: mockOnSuccess
    }));

    act(() => {
      result.current.handleFileSelection(largeMockFile);
    });

    expect(result.current.selectedFile).toBeNull();
  });

  test('should clear selected file', () => {
    const { result } = renderHook(() => useFileUpload({
      onSuccess: mockOnSuccess
    }));

    act(() => {
      result.current.handleFileSelection(mockFile);
      result.current.clearSelectedFile();
    });

    expect(result.current.selectedFile).toBeNull();
    expect(result.current.uploadStatus).toBe('idle');
    expect(result.current.errorMessage).toBeNull();
  });
});
