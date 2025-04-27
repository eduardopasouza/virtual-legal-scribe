
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus, Filter, SlidersHorizontal } from 'lucide-react';
import { useCaseOperations } from '@/hooks/useCaseOperations';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Cases() {
  const { cases, isLoading } = useCaseOperations();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');

  // Filter cases based on search term and filters
  const filteredCases = cases?.filter(caseItem => {
    const matchesSearch = searchTerm 
      ? caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (caseItem.number && caseItem.number.toLowerCase().includes(searchTerm.toLowerCase())) ||
        caseItem.client.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesStatus = statusFilter === 'all' ? true : caseItem.status === statusFilter;
    const matchesArea = areaFilter === 'all' ? true : caseItem.area_direito === areaFilter;
    
    return matchesSearch && matchesStatus && matchesArea;
  });
  
  // Get unique areas for filter
  const uniqueAreas = [...new Set(cases?.map(caseItem => caseItem.area_direito).filter(Boolean))];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-evji-primary">Gerenciamento de Casos</h1>
              <Link to="/novo-caso">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Caso
                </Button>
              </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="relative flex-1">
                <Input
                  type="search"
                  placeholder="Buscar casos..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="flex gap-2 w-full lg:w-auto">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full lg:w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={areaFilter} onValueChange={setAreaFilter}>
                  <SelectTrigger className="w-full lg:w-[180px]">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Área" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Áreas</SelectItem>
                    {uniqueAreas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center p-12">
                <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-evji-primary mx-auto"></div>
                <p className="mt-4">Carregando casos...</p>
              </div>
            ) : filteredCases?.length === 0 ? (
              <div className="text-center p-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Nenhum caso encontrado</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' || areaFilter !== 'all' 
                    ? "Nenhum caso corresponde aos filtros aplicados." 
                    : "Você ainda não tem casos cadastrados."}
                </p>
                <Link to="/novo-caso" className="mt-4 inline-block">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar novo caso
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCases?.map((caseItem) => (
                  <Link to={`/cases/${caseItem.id}`} key={caseItem.id}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-2">
                          <Badge
                            className={
                              caseItem.status === 'em_andamento'
                                ? 'bg-amber-500'
                                : caseItem.status === 'concluido'
                                ? 'bg-green-500'
                                : 'bg-gray-500'
                            }
                          >
                            {caseItem.status === 'em_andamento'
                              ? 'Em andamento'
                              : caseItem.status === 'concluido'
                              ? 'Concluído'
                              : 'Arquivado'}
                          </Badge>
                          {caseItem.area_direito && (
                            <Badge variant="outline">{caseItem.area_direito}</Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{caseItem.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground space-y-2">
                          <div>
                            <span className="font-medium">Cliente:</span> {caseItem.client}
                          </div>
                          {caseItem.number && (
                            <div>
                              <span className="font-medium">Número:</span> {caseItem.number}
                            </div>
                          )}
                          <div>
                            <span className="font-medium">Criado em:</span>{' '}
                            {format(new Date(caseItem.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// Simple search icon component
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}
