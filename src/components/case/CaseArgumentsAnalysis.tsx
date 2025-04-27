
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Shield, ShieldAlert, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ArgumentsAnalysisData } from './types';

export function CaseArgumentsAnalysis({ analysisData, isLoading = false, iconColor = 'text-blue-600' }: {
  analysisData?: ArgumentsAnalysisData;
  isLoading?: boolean;
  iconColor?: string;
}) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className={`h-5 w-5 ${iconColor}`} />
            Análise de Argumentos
          </CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="h-24 bg-gray-200 rounded-lg mb-4" />
          <div className="h-16 bg-gray-200 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!analysisData) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className={`h-5 w-5 ${iconColor}`} />
            Análise de Argumentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Nenhuma análise de argumentos realizada ainda. Execute a análise para visualizar.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStrengthBadge = (strength: 'strong' | 'medium' | 'weak') => {
    switch (strength) {
      case 'strong':
        return <Badge className="bg-green-100 text-green-800">Forte</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800">Médio</Badge>;
      case 'weak':
        return <Badge className="bg-red-100 text-red-800">Fraco</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className={`h-5 w-5 ${iconColor}`} />
          Análise de Argumentos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Argumentos da Parte Autora */}
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-green-600" />
            Argumentos da Parte Autora
          </h3>
          <div className="space-y-4">
            {analysisData.plaintiffArguments.map((arg, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium">{arg.argument}</p>
                  {getStrengthBadge(arg.strength)}
                </div>
                {arg.supportingEvidence && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Evidências de Suporte:</p>
                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                      {arg.supportingEvidence.map((evidence, eidx) => (
                        <li key={eidx}>{evidence}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Argumentos da Parte Ré */}
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-3">
            <ShieldAlert className="h-4 w-4 text-red-600" />
            Argumentos da Parte Ré
          </h3>
          <div className="space-y-4">
            {analysisData.defendantArguments.map((arg, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium">{arg.argument}</p>
                  {getStrengthBadge(arg.strength)}
                </div>
                {arg.counterEvidence && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Contra-evidências:</p>
                    <ul className="text-sm text-muted-foreground list-disc pl-5">
                      {arg.counterEvidence.map((evidence, eidx) => (
                        <li key={eidx}>{evidence}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Principais Controvérsias */}
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            Principais Controvérsias
          </h3>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            {analysisData.keyDisputes.map((dispute, idx) => (
              <li key={idx}>{dispute}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
