
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export function UpcomingEvents() {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-evji-accent" />
          Compromissos Próximos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="border-l-2 border-evji-accent pl-3 py-1">
            <p className="font-medium">Audiência Preliminar</p>
            <p className="text-xs text-muted-foreground">Hoje, 14:00 - Caso #12345</p>
          </div>
          <div className="border-l-2 border-gray-300 pl-3 py-1">
            <p className="font-medium">Prazo para Contestação</p>
            <p className="text-xs text-muted-foreground">Amanhã, 18:00 - Caso #12349</p>
          </div>
          <div className="border-l-2 border-gray-300 pl-3 py-1">
            <p className="font-medium">Reunião com Cliente</p>
            <p className="text-xs text-muted-foreground">23/04, 10:00 - Caso #12356</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" onClick={() => navigate('/calendar')}>
          Ver calendário completo
        </Button>
      </CardFooter>
    </Card>
  );
}
