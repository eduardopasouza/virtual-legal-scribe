
import { useDocumentUpload } from './useDocumentUpload';
import { useDocumentManagement } from './useDocumentManagement';
import { DocumentProcessingService } from '@/services/documentProcessing';

export { type DocumentMetadata } from '@/types/document';

export function useDocuments(caseId?: string) {
  const { uploadDocument, isUploading } = useDocumentUpload(caseId);
  const { getDocumentUrl, listDocuments, deleteDocument } = useDocumentManagement();

  const processDocument = async (documentId: string) => {
    try {
      // Update document status to processing
      await supabase
        .from('documents')
        .update({ processed_status: 'pending' })
        .eq('id', documentId);
      
      const { data: docData, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();
      
      if (fetchError || !docData.file_path) {
        throw new Error('Document not found');
      }
      
      // Get document URL and process content
      const { data: urlData } = await supabase.storage
        .from('documents')
        .createSignedUrl(docData.file_path, 3600);
        
      const content = await DocumentProcessingService.extractTextFromUrl(urlData.signedUrl);
      
      // Update document status based on processing result
      await supabase
        .from('documents')
        .update({ 
          processed_status: content.text ? 'processed' : 'failed',
          has_extracted_text: Boolean(content.text),
          content_size: content.text?.length || 0
        })
        .eq('id', documentId);
      
      return content;
    } catch (error: any) {
      console.error('Error processing document:', error);
      
      await supabase
        .from('documents')
        .update({ processed_status: 'failed' })
        .eq('id', documentId);
        
      throw error;
    }
  };

  return {
    uploadDocument,
    getDocumentUrl,
    listDocuments,
    deleteDocument,
    processDocument,
    isUploading
  };
}
