
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/lib/auth/AuthContext';

export interface DocumentMetadata {
  id?: string;
  name: string;
  size: number;
  type: string;
  case_id?: string | null;
  uploaded_at?: string;
  file_path?: string;
  created_by?: string;
}

export function useDocuments(caseId?: string) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadDocument = async (file: File) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para fazer upload de documentos.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      // Include user ID in the path for RLS
      const filePath = caseId 
        ? `${user.id}/case-${caseId}/${fileName}`
        : `${user.id}/general/${fileName}`;

      // Upload to Supabase storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (storageError) throw storageError;

      // Store document metadata in database
      const documentMetadata = {
        id: uuidv4(),
        name: file.name,
        size: file.size,
        type: file.type,
        case_id: caseId || null,
        uploaded_at: new Date().toISOString(),
        file_path: filePath,
        created_by: user.id
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

  const getDocumentUrl = async (filePath: string) => {
    // Create a signed URL that expires in 1 hour
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 3600);

    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }

    return data.signedUrl;
  };

  const listDocuments = async (caseId?: string) => {
    if (!user) {
      console.error('User must be authenticated to list documents');
      return [];
    }

    try {
      let query = supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (caseId) {
        query = query.eq('case_id', caseId);
      }

      // Apply user filter
      query = query.eq('created_by', user.id);

      const { data, error } = await query;

      if (error) throw error;
      return data as DocumentMetadata[];
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
