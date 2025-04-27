
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, FileText, Users, BarChart2 } from "lucide-react";

export function DatabaseAccess() {
  const navigate = useNavigate();
  
  return (
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
  );
}
