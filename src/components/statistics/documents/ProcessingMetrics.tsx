
import React from 'react';

interface ProcessingMetricsProps {
  totalDocuments: number;
  averageDocumentsPerCase: number;
  averageProcessingTime: number;
}

export const ProcessingMetrics = ({
  totalDocuments,
  averageDocumentsPerCase,
  averageProcessingTime
}: ProcessingMetricsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-muted rounded-lg text-center">
          <span className="text-3xl font-bold">{totalDocuments}</span>
          <p className="text-sm text-muted-foreground mt-1">Documentos Totais</p>
        </div>
        <div className="p-4 bg-muted rounded-lg text-center">
          <span className="text-3xl font-bold">{averageDocumentsPerCase}</span>
          <p className="text-sm text-muted-foreground mt-1">Média por Caso</p>
        </div>
      </div>

      <div className="text-center p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">Tempo Médio de Processamento</p>
        <span className="text-xl font-bold">{averageProcessingTime} segundos</span>
      </div>
    </>
  );
};
