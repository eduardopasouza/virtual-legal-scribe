import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LegalIssue } from './types';

interface CaseLegalIssuesProps {
  issuesData?: LegalIssue[];
  isLoading?: boolean;
  iconColor?: string;
}

export function CaseLegalIssues({ issuesData, isLoading = false, iconColor = 'text-gray-600' }: CaseLegalIssuesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className={`h-5 w-5 ${iconColor}`} />
            Problemas Jurídicos Identificados
          </CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="h-24 bg-gray-200 rounded-lg mb-4" />
          <div className="h-16 bg-gray-200 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!issuesData || issuesData.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className={`h-5 w-5 ${iconColor}`} />
            Problemas Jurídicos Identificados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Nenhum problema jurídico identificado ainda. Execute a análise para visualizar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className={`h-5 w-5 ${iconColor}`} />
          Problemas Jurídicos Identificados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {issuesData.map((issue) => (
            <div key={issue.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{issue.issue}</h3>
                <Badge
                  className={
                    issue.priority === 'high' ? 'bg-red-100 text-red-800' :
                    issue.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-green-100 text-green-800'
                  }
                >
                  {issue.priority === 'high' ? 'Alta Prioridade' :
                   issue.priority === 'medium' ? 'Média Prioridade' :
                   'Baixa Prioridade'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
              
              <div className="mt-3">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Fatos Relacionados:
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {issue.relatedFacts.map((fact, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {fact}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
