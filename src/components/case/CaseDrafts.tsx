
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { WebChat } from '@/components/WebChat';

interface CaseDraftsProps {
  caseId?: string;
}

export function CaseDrafts({ caseId }: CaseDraftsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600" />
          Redação de Documentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Converse com nosso assistente jurídico para elaborar o documento mais adequado para o seu caso.
            O sistema analisará o contexto, objetivos e estratégias para sugerir e redigir o melhor tipo de peça.
          </p>
          
          <WebChat 
            caseId={caseId}
            fullScreen={false}
            onClientIdentified={(clientData) => {
              console.log('Cliente identificado:', clientData);
            }}
            onWorkflowSelected={(workflow) => {
              console.log('Workflow selecionado:', workflow);
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
