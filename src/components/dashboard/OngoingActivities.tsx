
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

export function OngoingActivities() {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-evji-accent" />
          Atividades em Andamento
        </CardTitle>
        <CardDescription>
          Últimas atividades registradas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex justify-between items-center border-b pb-3 last:border-0">
              <div>
                <p className="font-medium">Análise de documentação - Caso #{123 + index}</p>
                <p className="text-sm text-muted-foreground">Agente: Analista de Fatos</p>
              </div>
              <Badge variant={index === 0 ? "default" : "outline"}>
                {index === 0 ? "Em andamento" : "Pendente"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
          Ver todas as atividades
        </Button>
      </CardFooter>
    </Card>
  );
}
