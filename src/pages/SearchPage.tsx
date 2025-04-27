
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchIcon, FileText, User, Calendar, Tag, Filter } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data for search results
const mockDocuments = [
  { 
    id: '1', 
    title: 'Petição Inicial - Danos Morais', 
    type: 'Petição',
    date: new Date('2024-04-10'),
    case: 'Processo nº 0123456-78.2024.8.26.0100',
    tags: ['danos morais', 'petição inicial'],
    excerpt: 'A presente ação tem como objetivo buscar indenização por danos morais em razão da publicação indevida de dados pessoais...'
  },
  { 
    id: '2', 
    title: 'Contestação - Processo Tributário', 
    type: 'Contestação',
    date: new Date('2024-03-15'),
    case: 'Processo nº 0987654-32.2024.8.26.0100',
    tags: ['tributário', 'contestação'],
    excerpt: 'Em resposta à petição inicial apresentada pelo autor, vimos apresentar contestação com base nos seguintes argumentos de fato e de direito...'
  },
  { 
    id: '3', 
    title: 'Contrato de Prestação de Serviços', 
    type: 'Contrato',
    date: new Date('2024-02-20'),
    case: 'N/A',
    tags: ['contrato', 'serviços'],
    excerpt: 'Contrato de prestação de serviços advocatícios firmado entre as partes com o objetivo de representação em processos trabalhistas...'
  },
  { 
    id: '4', 
    title: 'Recurso de Apelação - João Santos', 
    type: 'Recurso',
    date: new Date('2024-04-05'),
    case: 'Processo nº 1234567-89.2023.8.26.0100',
    tags: ['apelação', 'recurso'],
    excerpt: 'Não se conformando com a r. sentença de fls., vem o réu, tempestivamente, interpor o presente RECURSO DE APELAÇÃO...'
  }
];

const mockCases = [
  {
    id: '1',
    title: 'Ação de Indenização por Danos Morais',
    client: 'Maria Silva',
    status: 'Em andamento',
    date: new Date('2024-04-10'),
    lastUpdate: new Date('2024-04-15'),
    tags: ['cível', 'danos morais']
  },
  {
    id: '2',
    title: 'Processo Tributário - Impugnação de Débito',
    client: 'Empresa ABC Ltda',
    status: 'Em andamento',
    date: new Date('2024-03-20'),
    lastUpdate: new Date('2024-04-12'),
    tags: ['tributário', 'impugnação']
  },
  {
    id: '3',
    title: 'Reclamação Trabalhista',
    client: 'João Santos',
    status: 'Concluído',
    date: new Date('2023-11-10'),
    lastUpdate: new Date('2024-02-25'),
    tags: ['trabalhista', 'reclamação']
  }
];

const mockClients = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(11) 98765-4321',
    cases: 2,
    lastActivity: new Date('2024-04-15')
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao.santos@email.com',
    phone: '(11) 91234-5678',
    cases: 1,
    lastActivity: new Date('2024-04-10')
  },
  {
    id: '3',
    name: 'Empresa ABC Ltda',
    email: 'contato@empresaabc.com',
    phone: '(11) 3456-7890',
    cases: 1,
    lastActivity: new Date('2024-04-12')
  }
];

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [documentFilters, setDocumentFilters] = useState({
    petitions: true,
    contracts: true,
    appeals: true
  });
  const [caseFilters, setCaseFilters] = useState({
    active: true,
    concluded: true,
    archived: true
  });
  const [dateFilter, setDateFilter] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  const filteredDocuments = mockDocuments.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredCases = mockCases.filter(caseItem => 
    caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-evji-primary">Busca Avançada</h1>
            
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Busque por documentos, casos, clientes..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filtros</h4>
                    <Separator />
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Tipos de Documento</h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="filter-petitions"
                            checked={documentFilters.petitions}
                            onCheckedChange={(checked) => 
                              setDocumentFilters({...documentFilters, petitions: checked === true})
                            }
                          />
                          <Label htmlFor="filter-petitions">Petições</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="filter-contracts"
                            checked={documentFilters.contracts}
                            onCheckedChange={(checked) => 
                              setDocumentFilters({...documentFilters, contracts: checked === true})
                            }
                          />
                          <Label htmlFor="filter-contracts">Contratos</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="filter-appeals"
                            checked={documentFilters.appeals}
                            onCheckedChange={(checked) => 
                              setDocumentFilters({...documentFilters, appeals: checked === true})
                            }
                          />
                          <Label htmlFor="filter-appeals">Recursos</Label>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Status do Caso</h5>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="filter-active"
                            checked={caseFilters.active}
                            onCheckedChange={(checked) => 
                              setCaseFilters({...caseFilters, active: checked === true})
                            }
                          />
                          <Label htmlFor="filter-active">Em andamento</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="filter-concluded"
                            checked={caseFilters.concluded}
                            onCheckedChange={(checked) => 
                              setCaseFilters({...caseFilters, concluded: checked === true})
                            }
                          />
                          <Label htmlFor="filter-concluded">Concluídos</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="filter-archived"
                            checked={caseFilters.archived}
                            onCheckedChange={(checked) => 
                              setCaseFilters({...caseFilters, archived: checked === true})
                            }
                          />
                          <Label htmlFor="filter-archived">Arquivados</Label>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Data</h5>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant={dateFilter === 'all' ? 'default' : 'outline'} 
                          size="sm"
                          className="w-full"
                          onClick={() => setDateFilter('all')}
                        >
                          Todas
                        </Button>
                        <Button 
                          variant={dateFilter === 'month' ? 'default' : 'outline'} 
                          size="sm"
                          className="w-full"
                          onClick={() => setDateFilter('month')}
                        >
                          Último mês
                        </Button>
                        <Button 
                          variant={dateFilter === 'quarter' ? 'default' : 'outline'} 
                          size="sm"
                          className="w-full"
                          onClick={() => setDateFilter('quarter')}
                        >
                          Último trimestre
                        </Button>
                        <Button 
                          variant={dateFilter === 'year' ? 'default' : 'outline'} 
                          size="sm"
                          className="w-full"
                          onClick={() => setDateFilter('year')}
                        >
                          Último ano
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setDocumentFilters({
                            petitions: true,
                            contracts: true,
                            appeals: true
                          });
                          setCaseFilters({
                            active: true,
                            concluded: true,
                            archived: true
                          });
                          setDateFilter('all');
                        }}
                      >
                        Limpar filtros
                      </Button>
                      <Button size="sm">Aplicar</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button type="submit">Buscar</Button>
            </form>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">
                  Todos ({filteredDocuments.length + filteredCases.length + filteredClients.length})
                </TabsTrigger>
                <TabsTrigger value="documents">
                  Documentos ({filteredDocuments.length})
                </TabsTrigger>
                <TabsTrigger value="cases">
                  Casos ({filteredCases.length})
                </TabsTrigger>
                <TabsTrigger value="clients">
                  Clientes ({filteredClients.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-6">
                {searchTerm ? (
                  <>
                    {filteredDocuments.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Documentos
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {filteredDocuments.slice(0, 2).map(doc => (
                              <div key={doc.id} className="p-4 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{doc.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                      <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                                      <span>{format(doc.date, 'dd/MM/yyyy', { locale: ptBR })}</span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm mt-2">{doc.excerpt}</p>
                                <div className="flex gap-1 mt-3">
                                  {doc.tags.map((tag, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                            {filteredDocuments.length > 2 && (
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => setActiveTab('documents')}
                              >
                                Ver todos os documentos ({filteredDocuments.length})
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {filteredCases.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Casos
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {filteredCases.slice(0, 2).map(caseItem => (
                              <div key={caseItem.id} className="p-4 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{caseItem.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                      <span>Cliente: {caseItem.client}</span>
                                      <Badge variant="outline" className={`text-xs ${
                                        caseItem.status === 'Em andamento' ? 'bg-amber-500/20 text-amber-700' : 'bg-green-500/20 text-green-700'
                                      }`}>
                                        {caseItem.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-1 mt-3">
                                  {caseItem.tags.map((tag, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                            {filteredCases.length > 2 && (
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => setActiveTab('cases')}
                              >
                                Ver todos os casos ({filteredCases.length})
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {filteredClients.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Clientes
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {filteredClients.slice(0, 2).map(client => (
                              <div key={client.id} className="p-4 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{client.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                      <span>{client.email}</span>
                                      <span>•</span>
                                      <span>{client.phone}</span>
                                    </div>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {client.cases} caso{client.cases !== 1 ? 's' : ''}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                            {filteredClients.length > 2 && (
                              <Button 
                                variant="outline" 
                                className="w-full"
                                onClick={() => setActiveTab('clients')}
                              >
                                Ver todos os clientes ({filteredClients.length})
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {filteredDocuments.length === 0 && filteredCases.length === 0 && filteredClients.length === 0 && (
                      <div className="text-center py-12">
                        <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                        <h3 className="mt-4 text-lg font-medium">Nenhum resultado encontrado</h3>
                        <p className="mt-2 text-muted-foreground">
                          Tente buscar por outro termo ou refinar seus filtros.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                    <h3 className="mt-4 text-lg font-medium">Digite um termo para buscar</h3>
                    <p className="mt-2 text-muted-foreground">
                      Você pode buscar por documentos, casos, clientes e mais.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="documents" className="space-y-6">
                {searchTerm ? (
                  filteredDocuments.length > 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Documentos ({filteredDocuments.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {filteredDocuments.map(doc => (
                            <div key={doc.id} className="p-4 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{doc.title}</h3>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                                    <span>{format(doc.date, 'dd/MM/yyyy', { locale: ptBR })}</span>
                                    {doc.case !== 'N/A' && <span className="text-xs">• {doc.case}</span>}
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm mt-2">{doc.excerpt}</p>
                              <div className="flex gap-1 mt-3">
                                {doc.tags.map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                      <h3 className="mt-4 text-lg font-medium">Nenhum documento encontrado</h3>
                      <p className="mt-2 text-muted-foreground">
                        Tente buscar por outro termo ou refinar seus filtros.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                    <h3 className="mt-4 text-lg font-medium">Digite um termo para buscar documentos</h3>
                    <p className="mt-2 text-muted-foreground">
                      Você pode buscar por petições, contratos, recursos e outros documentos.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="cases" className="space-y-6">
                {searchTerm ? (
                  filteredCases.length > 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Casos ({filteredCases.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {filteredCases.map(caseItem => (
                            <div key={caseItem.id} className="p-4 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{caseItem.title}</h3>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <span>Cliente: {caseItem.client}</span>
                                    <Badge variant="outline" className={`text-xs ${
                                      caseItem.status === 'Em andamento' ? 'bg-amber-500/20 text-amber-700' : 'bg-green-500/20 text-green-700'
                                    }`}>
                                      {caseItem.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground mt-2">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>Aberto em {format(caseItem.date, 'dd/MM/yyyy', { locale: ptBR })}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>Última atualização: {format(caseItem.lastUpdate, 'dd/MM/yyyy', { locale: ptBR })}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-1 mt-3">
                                {caseItem.tags.map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                      <h3 className="mt-4 text-lg font-medium">Nenhum caso encontrado</h3>
                      <p className="mt-2 text-muted-foreground">
                        Tente buscar por outro termo ou refinar seus filtros.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                    <h3 className="mt-4 text-lg font-medium">Digite um termo para buscar casos</h3>
                    <p className="mt-2 text-muted-foreground">
                      Você pode buscar por títulos, clientes ou tags de casos.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="clients" className="space-y-6">
                {searchTerm ? (
                  filteredClients.length > 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Clientes ({filteredClients.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {filteredClients.map(client => (
                            <div key={client.id} className="p-4 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{client.name}</h3>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                    <span>{client.email}</span>
                                    <span>•</span>
                                    <span>{client.phone}</span>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {client.cases} caso{client.cases !== 1 ? 's' : ''}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground mt-2">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>Última atividade: {format(client.lastActivity, 'dd/MM/yyyy', { locale: ptBR })}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-12">
                      <User className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                      <h3 className="mt-4 text-lg font-medium">Nenhum cliente encontrado</h3>
                      <p className="mt-2 text-muted-foreground">
                        Tente buscar por outro termo ou refinar seus filtros.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <User className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                    <h3 className="mt-4 text-lg font-medium">Digite um termo para buscar clientes</h3>
                    <p className="mt-2 text-muted-foreground">
                      Você pode buscar por nome, email ou telefone de clientes.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
