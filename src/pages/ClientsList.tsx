
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, User, Calendar, Mail, Phone, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  cases: number;
  lastActivity: Date;
}

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

const statusLabels = {
  active: { label: 'Ativo', color: 'bg-green-500' },
  inactive: { label: 'Inativo', color: 'bg-gray-400' },
  pending: { label: 'Pendente', color: 'bg-amber-500' }
};

const ClientsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus ? client.status === filterStatus : true;
    
    return matchesSearch && matchesFilter;
  });
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

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
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <TabsList>
                      <TabsTrigger value="todos" onClick={() => setFilterStatus(null)}>
                        Todos
                      </TabsTrigger>
                      <TabsTrigger value="ativos" onClick={() => setFilterStatus('active')}>
                        Ativos
                      </TabsTrigger>
                      <TabsTrigger value="inativos" onClick={() => setFilterStatus('inactive')}>
                        Inativos
                      </TabsTrigger>
                      <TabsTrigger value="pendentes" onClick={() => setFilterStatus('pending')}>
                        Pendentes
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Buscar clientes..." 
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <TabsContent value="todos" className="m-0">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead className="hidden md:table-cell">Email</TableHead>
                            <TableHead className="hidden lg:table-cell">Telefone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden md:table-cell">Casos</TableHead>
                            <TableHead className="hidden lg:table-cell">Última Atividade</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredClients.length > 0 ? (
                            filteredClients.map((client) => (
                              <TableRow key={client.id}>
                                <TableCell className="font-medium">{client.name}</TableCell>
                                <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                                <TableCell className="hidden lg:table-cell">{client.phone}</TableCell>
                                <TableCell>
                                  <Badge className={statusLabels[client.status].color}>
                                    {statusLabels[client.status].label}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{client.cases}</TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  {formatDate(client.lastActivity)}
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        Ver Perfil
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Enviar Email
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Phone className="mr-2 h-4 w-4" />
                                        Ligar
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Agendar Reunião
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center">
                                Nenhum cliente encontrado.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ativos" className="m-0">
                    <div className="rounded-md border">
                      {/* O conteúdo é gerenciado pelo estado filterStatus */}
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead className="hidden md:table-cell">Email</TableHead>
                            <TableHead className="hidden lg:table-cell">Telefone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden md:table-cell">Casos</TableHead>
                            <TableHead className="hidden lg:table-cell">Última Atividade</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredClients.length > 0 ? (
                            filteredClients.map((client) => (
                              <TableRow key={client.id}>
                                <TableCell className="font-medium">{client.name}</TableCell>
                                <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                                <TableCell className="hidden lg:table-cell">{client.phone}</TableCell>
                                <TableCell>
                                  <Badge className={statusLabels[client.status].color}>
                                    {statusLabels[client.status].label}
                                  </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{client.cases}</TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  {formatDate(client.lastActivity)}
                                </TableCell>
                                <TableCell>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" />
                                        Ver Perfil
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Enviar Email
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Phone className="mr-2 h-4 w-4" />
                                        Ligar
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Agendar Reunião
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center">
                                Nenhum cliente encontrado.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="inativos" className="m-0">
                    {/* Conteúdo gerenciado pelo estado filterStatus */}
                  </TabsContent>
                  
                  <TabsContent value="pendentes" className="m-0">
                    {/* Conteúdo gerenciado pelo estado filterStatus */}
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
