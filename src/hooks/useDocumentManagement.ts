
import { supabase } from '@/integrations/supabase/client';
import { DocumentMetadata } from '@/types/document';
import { useToast } from '@/hooks/use-toast';

export function useDocumentManagement() {
  const { toast } = useToast();

  const getDocumentUrl = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600);

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting document URL:', error);
      return null;
    }
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
    try {
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);
        
      if (storageError) throw storageError;
      
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId);
        
      if (dbError) throw dbError;
      
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
    getDocumentUrl,
    listDocuments,
    deleteDocument
  };
}
