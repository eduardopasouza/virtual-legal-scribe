
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Paperclip, Upload } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDocuments, DocumentMetadata } from '@/hooks/useDocuments';

interface CaseDocumentsProps {
  caseId?: string;
}

export function CaseDocuments({ caseId }: CaseDocumentsProps) {
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
  const { listDocuments, getDocumentUrl } = useDocuments(caseId);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (caseId) {
        const docs = await listDocuments(caseId);
        setDocuments(docs);
      }
    };
    
    fetchDocuments();
  }, [caseId]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Documentos do Caso</CardTitle>
        <CardDescription>
          Todos os documentos relacionados a este caso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.length === 0 ? (
            <div className="text-center p-6 text-muted-foreground">
              Nenhum documento encontrado para este caso.
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(doc.size)} • {
                        doc.uploaded_at 
                          ? format(new Date(doc.uploaded_at), 'dd/MM/yyyy', { locale: ptBR })
                          : 'Data desconhecida'
                      }
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    if (doc.file_path) {
                      window.open(getDocumentUrl(doc.file_path), '_blank');
                    }
                  }}
                  disabled={!doc.file_path}
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
