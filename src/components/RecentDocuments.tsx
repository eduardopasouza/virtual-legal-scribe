
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { File, Clock } from "lucide-react";

interface Document {
  id: number;
  name: string;
  type: string;
  status: 'analyzing' | 'writing' | 'reviewing' | 'completed';
  date: string;
}

export function RecentDocuments() {
  const documents: Document[] = [
    {
      id: 1,
      name: "Petição Inicial - Caso Silva",
      type: "Petição",
      status: 'completed',
      date: "24/04/2025"
    },
    {
      id: 2,
      name: "Contestação - Processo 1234567-89.2025",
      type: "Contestação",
      status: 'reviewing',
      date: "25/04/2025"
    },
    {
      id: 3,
      name: "Recurso Ordinário - Empresa Beta",
      type: "Recurso",
      status: 'writing',
      date: "26/04/2025"
    },
    {
      id: 4,
      name: "Análise de Contrato - Cliente Gama",
      type: "Análise",
      status: 'analyzing',
      date: "27/04/2025"
    },
  ];
  
  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'analyzing':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Em análise</Badge>;
      case 'writing':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Em redação</Badge>;
      case 'reviewing':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Em revisão</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Concluído</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Documentos Recentes</CardTitle>
          <CardDescription>
            Os últimos documentos processados pelo sistema.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="document-card flex items-start justify-between">
              <div className="flex gap-3">
                <File className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">{doc.name}</h4>
                  <p className="text-xs text-muted-foreground">{doc.type}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                {getStatusBadge(doc.status)}
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{doc.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
