
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

      if (storageError) {
        console.error('Storage error:', storageError);
        throw storageError;
      }

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

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      toast({
        title: "Documento enviado",
        description: "O documento foi enviado com sucesso."
      });

      return documentMetadata;

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Erro ao enviar documento",
        description: error.message || "Ocorreu um erro ao fazer upload do documento.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const getDocumentUrl = async (filePath: string) => {
    try {
      // Create a signed URL that expires in 1 hour
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600);

      if (error) {
        console.error('Error creating signed URL:', error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Error getting document URL:', error);
      return null;
    }
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
      console.error('List documents error:', error);
      toast({
        title: "Erro ao buscar documentos",
        description: error.message,
        variant: "destructive"
      });
      return [];
    }
  };

  const deleteDocument = async (docId: string, filePath: string) => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para excluir documentos.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      // Delete from storage first
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);
        
      if (storageError) throw storageError;
      
      // Then delete metadata from database
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId);
        
      if (dbError) throw dbError;
      
      toast({
        title: "Documento excluído",
        description: "O documento foi excluído com sucesso."
      });
      
      return true;
    } catch (error: any) {
      console.error('Delete document error:', error);
      toast({
        title: "Erro ao excluir documento",
        description: error.message,
        variant: "destructive"
      });
      return false;
    }
  };

  return { 
    uploadDocument, 
    getDocumentUrl, 
    listDocuments,
    deleteDocument,
    isUploading 
  };
}
