
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CaseInformationProps {
  number: string;
  court: string;
  client: string;
  mainAgent: string;
  description: string;
}

export function CaseInformation({ 
  number, 
  court, 
  client, 
  mainAgent, 
  description 
}: CaseInformationProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Informações do Processo</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Número do processo</dt>
              <dd>{number}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Vara</dt>
              <dd>{court}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Cliente</dt>
              <dd className="font-medium">{client}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Agente principal</dt>
              <dd>{mainAgent}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Descrição</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
