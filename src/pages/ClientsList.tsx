
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, Filter, SlidersHorizontal } from 'lucide-react';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { ClientsFilter } from '@/components/clients/ClientsFilter';
import { ClientsGrid } from '@/components/clients/ClientsGrid';
import { ClientsStats } from '@/components/clients/ClientsStats';
import { ClientsMap } from '@/components/clients/ClientsMap';
import { ClientFilter, Client } from '@/types/client';
import { useClients } from '@/hooks/useClients';

const ClientsList = () => {
  // Em um cenário real, isso viria do hook useClients
  const { clients, isLoading, error, stats } = useClients();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filter, setFilter] = useState<ClientFilter>({
    search: '',
    status: null,
    type: null,
    tags: [],
    responsibleLawyer: null
  });
  
  const handleFilterChange = (newFilter: Partial<ClientFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  const handleCreateClient = () => {
    // Implementar navegação para página de criação de cliente
    // ou abrir modal de criação
  };

  const handleExportData = () => {
    // Implementar exportação de dados dos clientes
  };

  const handleImportData = () => {
    // Implementar importação de dados dos clientes
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-evji-primary">Clientes</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleImportData}>
              <Upload className="h-4 w-4 mr-2" />
              Importar
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button onClick={handleCreateClient}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </div>
        </div>

        {/* Estatísticas dos clientes */}
        <ClientsStats stats={stats} isLoading={isLoading} />
        
        {/* Conteúdo principal */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Gerenciamento de Clientes</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === 'list' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  Lista
                </Button>
                <Button
                  variant={viewMode === 'grid' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Cartões
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="todos" className="mt-2">
              <ClientsFilter 
                filter={filter}
                onFilterChange={handleFilterChange}
              />
              
              <TabsContent value="todos" className="m-0">
                {viewMode === 'list' ? (
                  <ClientsTable clients={clients} isLoading={isLoading} error={error} />
                ) : (
                  <ClientsGrid clients={clients} isLoading={isLoading} error={error} />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Mapa de distribuição de clientes */}
        <ClientsMap clients={clients} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
};

export default ClientsList;
