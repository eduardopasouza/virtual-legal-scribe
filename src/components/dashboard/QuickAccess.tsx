
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, FileText, Users, BarChart2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export function QuickAccess() {
  const navigate = useNavigate();
  
  const goToNewCase = () => navigate('/novo-caso');
  const goToCases = () => navigate('/cases/list');
  const goToClients = () => navigate('/clients');
  const goToStats = () => navigate('/stats');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5 text-evji-accent" />
          Acesso Rápido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="flex flex-col h-24 gap-2 p-3 hover:bg-evji-accent/10"
            onClick={goToNewCase}
          >
            <FileText className="h-10 w-10 text-evji-primary" />
            <span>Novo Caso</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col h-24 gap-2 p-3 hover:bg-evji-accent/10"
            onClick={goToCases}
          >
            <FileText className="h-10 w-10 text-evji-primary" />
            <span>Casos</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col h-24 gap-2 p-3 hover:bg-evji-accent/10"
            onClick={goToClients}
          >
            <Users className="h-10 w-10 text-evji-primary" />
            <span>Clientes</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col h-24 gap-2 p-3 hover:bg-evji-accent/10"
            onClick={goToStats}
          >
            <BarChart2 className="h-10 w-10 text-evji-primary" />
            <span>Estatísticas</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
