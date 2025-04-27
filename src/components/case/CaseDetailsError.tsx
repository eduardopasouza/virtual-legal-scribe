
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function CaseDetailsError() {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout>
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Erro ao carregar detalhes do caso</h2>
        <p className="text-muted-foreground mb-6">Não foi possível acessar as informações deste caso.</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/cases/list')}>
            Ver todos os casos
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
