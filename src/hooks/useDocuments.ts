
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useDocuments(caseId: string) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadDocument = async (file: File) => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const filePath = `${caseId}/${Math.random()}.${fileExt}`;

      const { error } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (error) throw error;

      toast({
        title: "Documento enviado",
        description: "O documento foi enviado com sucesso."
      });

    } catch (error: any) {
      toast({
        title: "Erro ao enviar documento",
        description: error.message,
        variant: "destructive"
      });
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

  return { uploadDocument, getDocumentUrl, isUploading };
}
