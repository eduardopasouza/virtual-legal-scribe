
import React from 'react';
import { Case } from "@/types/case";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";

interface CaseCardProps {
  caseItem: Case;
}

export function CaseCard({ caseItem }: CaseCardProps) {
  return (
    <Link to={`/casos/${caseItem.id}`}>
      <Card className="hover-scale card-hover h-full">
        <CardHeader className="space-y-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-medium leading-tight line-clamp-2">{caseItem.title}</h3>
            <Badge variant={caseItem.status === 'Em andamento' ? 'default' : 'secondary'}>
              {caseItem.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="line-clamp-1">
                {caseItem.area_direito || 'Área não especificada'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(caseItem.created_at), "d 'de' MMMM',' yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>
          {caseItem.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {caseItem.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
