
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Calendar, Database, FileText, Users, BarChart2 } from "lucide-react";

export function DashboardSidebar() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm">Sem alertas pendentes no momento.</p>
          </div>
        </CardContent>
      </Card>
      
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
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5 text-evji-accent" />
            Banco de Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/clients')}
            >
              <Users className="mr-2 h-4 w-4" />
              Clientes
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/cases/list')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Casos
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate('/stats')}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              Estatísticas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
