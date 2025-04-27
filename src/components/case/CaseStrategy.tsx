
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart2, AlertTriangle, CheckCircle, Target } from "lucide-react";

interface CaseStrategyProps {
  strategyData?: {
    mainThesis?: string;
    objectives?: string[];
    risks?: string[];
    recommendations?: string[];
    currentPhase?: 'initial' | 'intermediate' | 'final';
    alignmentStatus?: string;
  };
}

export function CaseStrategy({ strategyData }: CaseStrategyProps) {
  if (!strategyData) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-amber-600" />
            Estratégia do Caso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Nenhuma estratégia definida. Complete a etapa de Planejamento Estratégico para visualizar.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { mainThesis, objectives, risks, recommendations, currentPhase, alignmentStatus } = strategyData;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-amber-600" />
          Estratégia do Caso
          {currentPhase && (
            <Badge 
              variant="outline" 
              className={
                currentPhase === 'initial' ? "bg-blue-50 text-blue-700 ml-2" :
                currentPhase === 'intermediate' ? "bg-purple-50 text-purple-700 ml-2" :
                "bg-green-50 text-green-700 ml-2"
              }
            >
              {currentPhase === 'initial' ? "Inicial" : 
               currentPhase === 'intermediate' ? "Intermediária" : "Final"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mainThesis && (
          <div>
            <h3 className="font-medium flex items-center gap-1 mb-1">
              <Target className="h-4 w-4 text-amber-600" />
              Tese Principal
            </h3>
            <p className="text-sm">{mainThesis}</p>
          </div>
        )}

        {objectives && objectives.length > 0 && (
          <div>
            <h3 className="font-medium flex items-center gap-1 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Objetivos Estratégicos
            </h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        )}

        {risks && risks.length > 0 && (
          <div>
            <h3 className="font-medium flex items-center gap-1 mb-1">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Riscos Identificados
            </h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {risks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>
        )}

        {recommendations && recommendations.length > 0 && (
          <div>
            <h3 className="font-medium flex items-center gap-1 mb-1">
              <BarChart2 className="h-4 w-4 text-blue-600" />
              Recomendações
            </h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        )}

        {alignmentStatus && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Status de Alinhamento: {alignmentStatus}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
