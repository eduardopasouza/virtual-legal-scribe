
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Case } from "@/types/case";

interface CaseCardProps {
  caseItem: Case;
}

export function CaseCard({ caseItem }: CaseCardProps) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluido':
        return 'Concluído';
      case 'arquivado':
        return 'Arquivado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_andamento':
        return 'bg-amber-500';
      case 'concluido':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Link to={`/cases/${caseItem.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start mb-2">
            <Badge className={getStatusColor(caseItem.status)}>
              {getStatusLabel(caseItem.status)}
            </Badge>
            {caseItem.area_direito && (
              <Badge variant="outline">{caseItem.area_direito}</Badge>
            )}
          </div>
          <CardTitle className="text-lg line-clamp-2">{caseItem.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <div>
              <span className="font-medium">Cliente:</span> {caseItem.client}
            </div>
            {caseItem.number && (
              <div>
                <span className="font-medium">Número:</span> {caseItem.number}
              </div>
            )}
            <div>
              <span className="font-medium">Criado em:</span>{' '}
              {format(new Date(caseItem.created_at), 'dd/MM/yyyy', { locale: ptBR })}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
