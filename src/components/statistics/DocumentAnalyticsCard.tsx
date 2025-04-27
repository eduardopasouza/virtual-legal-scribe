
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DocumentMetrics } from '@/types/statistics';

interface DocumentAnalyticsCardProps {
  data?: DocumentMetrics;
  isLoading?: boolean;
}

export const DocumentAnalyticsCard = ({ data, isLoading }: DocumentAnalyticsCardProps) => {
  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Análise de Documentos</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4 items-center justify-center min-h-[350px]">
          <div className="text-muted-foreground">Carregando dados de documentos...</div>
        </CardContent>
      </Card>
    );
  }

  // Calculate total documents for percentage
  const totalDocs = data.documentTypes.reduce((sum, type) => sum + type.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Análise de Documentos</CardTitle>
        <CardDescription>
          Distribuição por tipo de documento e métricas de processamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg text-center">
            <span className="text-3xl font-bold">{data.totalDocuments}</span>
            <p className="text-sm text-muted-foreground mt-1">Documentos Totais</p>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <span className="text-3xl font-bold">{data.averageDocumentsPerCase}</span>
            <p className="text-sm text-muted-foreground mt-1">Média por Caso</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Distribuição por Tipo</h4>
          <div className="space-y-3">
            {data.documentTypes.map((type, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{type.type}</span>
                  <span className="text-muted-foreground">
                    {type.count} ({Math.round((type.count / totalDocs) * 100)}%)
                  </span>
                </div>
                <Progress value={(type.count / totalDocs) * 100} />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Tempo Médio de Processamento</p>
          <span className="text-xl font-bold">{data.averageProcessingTime} segundos</span>
        </div>
      </CardContent>
    </Card>
  );
};
