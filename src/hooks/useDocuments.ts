
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
  uploaded_at?: string;  // Changed from Date to string to match Supabase's format
  file_path?: string;
  created_by?: string;
}

export function useDocuments(caseId?: string) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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

      // Store document metadata in database with user ID
      const documentMetadata = {
        id: uuidv4(),
        name: file.name,
        size: file.size,
        type: file.type,
        case_id: caseId || null,
        uploaded_at: new Date().toISOString(),  // Store as ISO string
        file_path: filePath,
        created_by: user?.id  // Adiciona o ID do usuário autenticado
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
      let query = supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (caseId) {
        query = query.eq('case_id', caseId);
      }

      // Aplica filtro de usuário se autenticado
      if (user) {
        query = query.eq('created_by', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      // The returned data will match our DocumentMetadata interface
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
