
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, BookOpen, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RulesData {
  relevantLegislation: {
    name: string;
    articles: string[];
  }[];
  jurisprudence: string[];
  doctrines: string[];
}

interface CaseRulesProps {
  rulesData?: RulesData;
  isLoading?: boolean;
}

export function CaseRules({ rulesData, isLoading = false }: CaseRulesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-purple-600" />
            Regras Jurídicas Aplicáveis
          </CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="h-24 bg-gray-200 rounded-lg mb-4" />
          <div className="h-16 bg-gray-200 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (!rulesData) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-purple-600" />
            Regras Jurídicas Aplicáveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Nenhuma análise de regras jurídicas realizada ainda. Execute a análise para visualizar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-purple-600" />
          Regras Jurídicas Aplicáveis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Legislação Relevante */}
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-3">
            <ScrollText className="h-4 w-4 text-purple-600" />
            Legislação Relevante
          </h3>
          <div className="space-y-4">
            {rulesData.relevantLegislation.map((legislation, idx) => (
              <div key={idx} className="space-y-2">
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">{legislation.name}</Badge>
                <ul className="text-sm text-muted-foreground space-y-1 pl-5 list-disc">
                  {legislation.articles.map((article, artIdx) => (
                    <li key={artIdx}>{article}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Jurisprudência */}
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-purple-600" />
            Jurisprudência
          </h3>
          <ul className="text-sm text-muted-foreground space-y-2 pl-5 list-disc">
            {rulesData.jurisprudence.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Doutrina */}
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-purple-600" />
            Doutrina
          </h3>
          <ul className="text-sm text-muted-foreground space-y-2 pl-5 list-disc">
            {rulesData.doctrines.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
