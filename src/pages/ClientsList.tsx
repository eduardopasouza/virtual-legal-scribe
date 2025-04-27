import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Plus } from 'lucide-react';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { ClientsFilter } from '@/components/clients/ClientsFilter';
import { Client } from '@/types/client';

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(11) 98765-4321',
    status: 'active',
    cases: 2,
    lastActivity: new Date('2024-04-15')
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao.santos@email.com',
    phone: '(11) 91234-5678',
    status: 'active',
    cases: 1,
    lastActivity: new Date('2024-04-10')
  },
  {
    id: '3',
    name: 'Ana Oliveira',
    email: 'ana.oliveira@email.com',
    phone: '(11) 99876-5432',
    status: 'inactive',
    cases: 0,
    lastActivity: new Date('2024-03-20')
  },
  {
    id: '4',
    name: 'Carlos Pereira',
    email: 'carlos.pereira@email.com',
    phone: '(11) 92345-6789',
    status: 'pending',
    cases: 1,
    lastActivity: new Date('2024-04-18')
  },
  {
    id: '5',
    name: 'Lúcia Ferreira',
    email: 'lucia.ferreira@email.com',
    phone: '(11) 93456-7890',
    status: 'active',
    cases: 3,
    lastActivity: new Date('2024-04-16')
  },
  {
    id: '6',
    name: 'Roberto Costa',
    email: 'roberto.costa@email.com',
    phone: '(11) 94567-8901',
    status: 'inactive',
    cases: 0,
    lastActivity: new Date('2024-02-25')
  }
];

const ClientsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus ? client.status === filterStatus : true;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h1 className="text-2xl font-bold text-evji-primary">Clientes</h1>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Gerenciamento de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="todos" className="mt-2">
                  <ClientsFilter 
                    onFilterChange={setFilterStatus}
                    onSearchChange={setSearchTerm}
                    searchTerm={searchTerm}
                  />
                  
                  <TabsContent value="todos" className="m-0">
                    <ClientsTable clients={filteredClients} />
                  </TabsContent>
                  
                  <TabsContent value="ativos" className="m-0">
                    <ClientsTable clients={filteredClients} />
                  </TabsContent>
                  
                  <TabsContent value="inativos" className="m-0">
                    <ClientsTable clients={filteredClients} />
                  </TabsContent>
                  
                  <TabsContent value="pendentes" className="m-0">
                    <ClientsTable clients={filteredClients} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientsList;
