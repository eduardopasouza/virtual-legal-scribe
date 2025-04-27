
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar } from 'lucide-react';

interface CaseResultsProps {
  cases: any[];
  showCompact: boolean;
}

export function CaseResults({ cases, showCompact }: CaseResultsProps) {
  return (
    <>
      <CardHeader className={showCompact ? "pb-2" : ""}>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Casos {!showCompact && `(${cases.length})`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cases.map(caseItem => (
            <div key={caseItem.id} className="p-4 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{caseItem.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>Cliente: {caseItem.client}</span>
                    <Badge variant="outline" className={`text-xs ${
                      caseItem.status === 'Em andamento' ? 'bg-amber-500/20 text-amber-700' : 'bg-green-500/20 text-green-700'
                    }`}>
                      {caseItem.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {!showCompact && (
                <div className="text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Aberto em {format(caseItem.date, 'dd/MM/yyyy', { locale: ptBR })}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Última atualização: {format(caseItem.lastUpdate, 'dd/MM/yyyy', { locale: ptBR })}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-1 mt-3">
                {caseItem.tags.map((tag: string, i: number) => (
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
