
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCaseOperations } from '@/hooks/useCaseOperations';
import { Link } from 'react-router-dom';
import { CaseFilters } from '@/components/cases/CaseFilters';
import { CaseGrid } from '@/components/cases/CaseGrid';

export default function Cases() {
  const { cases, isLoading } = useCaseOperations();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  
  const uniqueAreas = [...new Set(cases?.map(caseItem => caseItem.area_direito).filter(Boolean))];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center p-12">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary mx-auto"></div>
          <p className="mt-4">Carregando casos...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gerenciamento de Casos</h1>
          <Link to="/novo-caso">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Caso
            </Button>
          </Link>
        </div>

        <CaseFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          areaFilter={areaFilter}
          onAreaChange={setAreaFilter}
          uniqueAreas={uniqueAreas}
        />

        <CaseGrid
          cases={cases || []}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          areaFilter={areaFilter}
        />
      </div>
    </DashboardLayout>
  );
}
