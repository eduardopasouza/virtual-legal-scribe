
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DocumentMetadata } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';

interface UploadMetadata {
  documentType?: string;
  hasExtractedText?: boolean;
  [key: string]: any;
}

export function useDocumentUpload(caseId?: string) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadDocument = async (file: File, metadata?: UploadMetadata) => {
    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = caseId 
        ? `documents/case-${caseId}/${fileName}`
        : `documents/general/${fileName}`;

      const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (storageError) throw storageError;

      const documentMetadata: DocumentMetadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        case_id: caseId || null,
        uploaded_at: new Date().toISOString(),
        file_path: filePath,
        document_type: metadata?.documentType,
        has_extracted_text: metadata?.hasExtractedText || false,
        processed_status: metadata?.hasExtractedText ? 'processed' : 'pending'
      };

      const { error: dbError } = await supabase
        .from('documents')
        .insert(documentMetadata);

      if (dbError) throw dbError;

      return documentMetadata;
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Erro ao enviar documento",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadDocument, isUploading };
}
