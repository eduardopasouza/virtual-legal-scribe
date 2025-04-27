
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Deadline {
  id: string;
  description: string;
  date: Date;
  status: string;
}

interface CaseDeadlinesProps {
  deadlines: Deadline[];
}

export function CaseDeadlines({ deadlines }: CaseDeadlinesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Prazos</CardTitle>
        <CardDescription>
          Prazos e datas importantes para este caso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deadlines.map((deadline) => (
            <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors">
              <div>
                <p className="font-medium">{deadline.description}</p>
                <p className="text-xs text-muted-foreground">
                  {format(deadline.date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
              <Badge 
                className={
                  deadline.status === 'pendente' 
                    ? 'bg-amber-500' 
                    : deadline.status === 'concluído' 
                    ? 'bg-green-500' 
                    : 'bg-red-500'
                }
              >
                {deadline.status === 'pendente' ? 'Pendente' : 
                 deadline.status === 'concluído' ? 'Concluído' : 'Atrasado'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
