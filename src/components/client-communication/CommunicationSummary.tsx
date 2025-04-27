
import React from 'react';
import { ClientCommunication } from '@/agents/comunicador/types';

interface CommunicationSummaryProps {
  communication: ClientCommunication;
}

export function CommunicationSummary({ communication }: CommunicationSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="bg-muted/40 p-4 rounded-md">
        <h3 className="font-semibold mb-2">Resumo Executivo</h3>
        <p>{communication.documentSummary}</p>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Explicação Simplificada</h3>
        <p>{communication.simplifiedExplanation}</p>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Pontos Principais</h3>
        <ul className="list-disc list-inside space-y-1">
          {communication.keyPoints.map((point, index) => (
            <li key={index} className="pl-2">{point}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
