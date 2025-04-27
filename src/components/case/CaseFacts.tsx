
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar, CircleDot, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Fact {
  data: string;
  descricao: string;
  fonte: string;
  controverso: boolean;
}

interface FactsAnalysis {
  cronologia: Fact[];
  partes: {
    autores: string[];
    reus: string[];
    terceiros?: string[];
  };
  fatosIncontroversos: string[];
  fatosControversos: string[];
  fontesAnalisadas: string[];
}

interface CaseFactsProps {
  analysisData?: FactsAnalysis | null;
  isLoading?: boolean;
}

export function CaseFacts({ analysisData, isLoading }: CaseFactsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Análise de Fatos
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  if (!analysisData) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Análise de Fatos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Nenhuma análise de fatos realizada. Execute a análise para visualizar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Análise de Fatos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cronologia */}
        <div>
          <h3 className="font-medium mb-3">Cronologia dos Fatos</h3>
          <div className="space-y-3">
            {analysisData.cronologia.map((fato, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <CircleDot className="h-4 w-4 mt-1 text-blue-600 shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{fato.data}</span>
                    {fato.controverso ? (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">
                        Controverso
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Incontroverso
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{fato.descricao}</p>
                  <p className="text-xs text-muted-foreground">Fonte: {fato.fonte}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Partes */}
        <div>
          <h3 className="font-medium mb-3">Partes Envolvidas</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h4 className="text-sm font-medium mb-2">Autores</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {analysisData.partes.autores.map((autor, index) => (
                  <li key={index}>{autor}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Réus</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {analysisData.partes.reus.map((reu, index) => (
                  <li key={index}>{reu}</li>
                ))}
              </ul>
            </div>
            {analysisData.partes.terceiros && analysisData.partes.terceiros.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Terceiros</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {analysisData.partes.terceiros.map((terceiro, index) => (
                    <li key={index}>{terceiro}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Fatos Controversos e Incontroversos */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Fatos Incontroversos
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              {analysisData.fatosIncontroversos.map((fato, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>{fato}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Fatos Controversos
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              {analysisData.fatosControversos.map((fato, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>{fato}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Fontes Analisadas */}
        <div>
          <h3 className="font-medium mb-3">Fontes Analisadas</h3>
          <ul className="text-sm text-muted-foreground grid grid-cols-2 gap-2">
            {analysisData.fontesAnalisadas.map((fonte, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>{fonte}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
