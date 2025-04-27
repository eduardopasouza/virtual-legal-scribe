
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Target, AlertTriangle, CheckCircle2, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StrategyData } from './types';

interface CaseStrategyProps {
  strategyData?: StrategyData;
  isLoading?: boolean;
}

export function CaseStrategy({ strategyData, isLoading = false }: CaseStrategyProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Estratégia e Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="h-24 bg-gray-200 rounded-lg mb-4" />
          <div className="h-16 bg-gray-200 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!strategyData) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Estratégia e Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Nenhuma estratégia formulada ainda. Execute a análise para visualizar.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { mainThesis, objectives, risks, recommendations, currentPhase } = strategyData;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          Estratégia e Recomendações
          <Badge className={
            currentPhase === 'final' ? 'bg-green-100 text-green-800' :
            currentPhase === 'intermediate' ? 'bg-blue-100 text-blue-800' :
            'bg-amber-100 text-amber-800'
          }>
            {currentPhase === 'final' ? 'Fase Final' :
             currentPhase === 'intermediate' ? 'Fase Intermediária' :
             'Fase Inicial'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tese Principal */}
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-2">
            <BarChart2 className="h-4 w-4 text-green-600" />
            Tese Principal
          </h3>
          <p className="text-sm bg-green-50 p-3 rounded-md">{mainThesis}</p>
        </div>
        
        {/* Objetivos */}
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-600" />
            Objetivos
          </h3>
          <ul className="space-y-2">
            {objectives.map((obj, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Riscos */}
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            Riscos Identificados
          </h3>
          <ul className="space-y-2">
            {risks.map((risk, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2">
                <span className="text-red-600 mt-0.5">•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Recomendações */}
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-purple-600" />
            Recomendações
          </h3>
          <ul className="space-y-2">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
