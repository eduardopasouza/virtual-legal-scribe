
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Users, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface FactItem {
  data: string;
  descricao: string;
  fonte: string;
  controverso: boolean;
}

interface FactsAnalysisData {
  cronologia: FactItem[];
  partes: {
    autores: string[];
    reus: string[];
    terceiros?: string[];
  };
  fontesAnalisadas: string[];
  fatosIncontroversos: string[];
  fatosControversos: string[];
}

interface CaseFactsProps {
  analysisData?: FactsAnalysisData;
  isLoading?: boolean;
}

export function CaseFacts({ analysisData, isLoading = false }: CaseFactsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise Factual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise Factual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Não há análise factual disponível para este caso.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise Factual</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="cronologia">
          <TabsList className="w-full">
            <TabsTrigger value="cronologia" className="flex-1">
              <CalendarIcon className="h-4 w-4 mr-2" /> Cronologia
            </TabsTrigger>
            <TabsTrigger value="partes" className="flex-1">
              <Users className="h-4 w-4 mr-2" /> Partes
            </TabsTrigger>
            <TabsTrigger value="fatos" className="flex-1">
              <FileText className="h-4 w-4 mr-2" /> Categorização
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="cronologia" className="pt-4">
            <div className="space-y-4">
              {analysisData.cronologia.map((item, index) => (
                <div key={index} className="border rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">{new Date(item.data).toLocaleDateString('pt-BR')}</div>
                    <Badge variant={item.controverso ? "destructive" : "outline"}>
                      {item.controverso ? 'Controverso' : 'Incontroverso'}
                    </Badge>
                  </div>
                  <p className="text-base">{item.descricao}</p>
                  <p className="text-xs text-muted-foreground mt-2">Fonte: {item.fonte}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="partes" className="pt-4">
            <div className="space-y-4">
              <div className="border rounded-md p-3">
                <h3 className="text-sm font-medium mb-2">Autores</h3>
                <ul className="list-disc list-inside text-sm">
                  {analysisData.partes.autores.map((autor, index) => (
                    <li key={index}>{autor}</li>
                  ))}
                </ul>
              </div>
              
              <div className="border rounded-md p-3">
                <h3 className="text-sm font-medium mb-2">Réus</h3>
                <ul className="list-disc list-inside text-sm">
                  {analysisData.partes.reus.map((reu, index) => (
                    <li key={index}>{reu}</li>
                  ))}
                </ul>
              </div>
              
              {analysisData.partes.terceiros && analysisData.partes.terceiros.length > 0 && (
                <div className="border rounded-md p-3">
                  <h3 className="text-sm font-medium mb-2">Terceiros Interessados</h3>
                  <ul className="list-disc list-inside text-sm">
                    {analysisData.partes.terceiros.map((terceiro, index) => (
                      <li key={index}>{terceiro}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="fatos" className="pt-4">
            <div className="space-y-4">
              <div className="border rounded-md p-3">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <h3 className="text-sm font-medium">Fatos Incontroversos</h3>
                </div>
                <ul className="list-disc list-inside text-sm">
                  {analysisData.fatosIncontroversos.map((fato, index) => (
                    <li key={index}>{fato}</li>
                  ))}
                </ul>
              </div>
              
              <div className="border rounded-md p-3">
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <h3 className="text-sm font-medium">Fatos Controversos</h3>
                </div>
                <ul className="list-disc list-inside text-sm">
                  {analysisData.fatosControversos.map((fato, index) => (
                    <li key={index}>{fato}</li>
                  ))}
                </ul>
              </div>
              
              <div className="border rounded-md p-3">
                <h3 className="text-sm font-medium mb-2">Fontes Analisadas</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisData.fontesAnalisadas.map((fonte, index) => (
                    <Badge key={index} variant="secondary">{fonte}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
