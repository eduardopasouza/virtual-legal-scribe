
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DocumentTypeDistribution } from './DocumentTypeDistribution';
import { ProcessingMetrics } from './ProcessingMetrics';
import { DocumentMetrics } from '@/types/statistics';

interface DocumentMetricsCardProps {
  data?: DocumentMetrics;
  isLoading?: boolean;
}

export const DocumentMetricsCard = ({ data, isLoading }: DocumentMetricsCardProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Análise de Documentos</CardTitle>
        <CardDescription>
          Distribuição por tipo de documento e métricas de processamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <DocumentTypeDistribution documentTypes={data.documentTypes} />
        <ProcessingMetrics
          totalDocuments={data.totalDocuments}
          averageDocumentsPerCase={data.averageDocumentsPerCase}
          averageProcessingTime={data.averageProcessingTime}
        />
      </CardContent>
    </Card>
  );
};
