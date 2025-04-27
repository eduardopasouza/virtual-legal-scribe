
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface DocumentMetadata {
  id?: string;
  name: string;
  size: number;
  type: string;
  case_id?: string;
  uploaded_at?: Date;
}

export function useDocuments(caseId?: string) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadDocument = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = caseId 
        ? `case-${caseId}/${fileName}` 
        : `general/${fileName}`;

      // Upload to Supabase storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (storageError) throw storageError;

      // Optional: Store document metadata in database
      const documentMetadata: DocumentMetadata = {
        id: uuidv4(),
        name: file.name,
        size: file.size,
        type: file.type,
        case_id: caseId,
        uploaded_at: new Date()
      };

      const { error: dbError } = await supabase
        .from('documents')
        .insert(documentMetadata);

      if (dbError) throw dbError;

      toast({
        title: "Documento enviado",
        description: "O documento foi enviado com sucesso."
      });

      return documentMetadata;

    } catch (error: any) {
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

  const getDocumentUrl = (filePath: string) => {
    return supabase.storage
      .from('documents')
      .getPublicUrl(filePath)
      .data.publicUrl;
  };

  const listDocuments = async (caseId?: string) => {
    try {
      const query = supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (caseId) {
        query.eq('case_id', caseId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao buscar documentos",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }
  };

  return { 
    uploadDocument, 
    getDocumentUrl, 
    listDocuments,
    isUploading 
  };
}
