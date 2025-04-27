
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Paperclip } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Document {
  name: string;
  size: string;
  date: Date;
}

interface CaseDocumentsProps {
  documents: Document[];
}

export function CaseDocuments({ documents }: CaseDocumentsProps) {
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
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.size} • {format(doc.date, 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Paperclip className="h-4 w-4 mr-2" />
                Baixar
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
