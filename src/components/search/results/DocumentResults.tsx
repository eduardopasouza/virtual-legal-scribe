
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from 'lucide-react';

interface DocumentResultsProps {
  documents: any[];
  showCompact: boolean;
}

export function DocumentResults({ documents, showCompact }: DocumentResultsProps) {
  return (
    <>
      <CardHeader className={showCompact ? "pb-2" : ""}>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documentos {!showCompact && `(${documents.length})`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map(doc => (
            <div key={doc.id} className="p-4 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{doc.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                    <span>{format(doc.date, 'dd/MM/yyyy', { locale: ptBR })}</span>
                    {!showCompact && doc.case !== 'N/A' && <span className="text-xs">• {doc.case}</span>}
                  </div>
                </div>
              </div>
              
              {!showCompact && <p className="text-sm mt-2">{doc.excerpt}</p>}
              
              <div className="flex gap-1 mt-3">
                {doc.tags.map((tag: string, i: number) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
}
