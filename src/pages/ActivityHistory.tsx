
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, User, Search, Filter, Calendar, ArrowDownWideNarrow, Eye } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  type: 'document' | 'case' | 'system';
  action: string;
  agent: string;
  caseId?: string;
  caseName?: string;
  date: Date;
  details?: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'document',
    action: 'Documento criado',
    agent: 'Redator',
    caseId: '1',
    caseName: 'Ação de Indenização por Danos Morais',
    date: new Date('2024-04-20T15:30:00'),
    details: 'Petição Inicial criada'
  },
  {
    id: '2',
    type: 'document',
    action: 'Documento analisado',
    agent: 'Analisador',
    caseId: '1',
    caseName: 'Ação de Indenização por Danos Morais',
    date: new Date('2024-04-20T16:15:00'),
    details: 'Análise da Petição Inicial concluída'
  },
  {
    id: '3',
    type: 'case',
    action: 'Caso atualizado',
    agent: 'Estrategista',
    caseId: '1',
    caseName: 'Ação de Indenização por Danos Morais',
    date: new Date('2024-04-20T17:00:00'),
    details: 'Estratégia do caso definida'
  },
  {
    id: '4',
    type: 'document',
    action: 'Documento revisado',
    agent: 'Revisor',
    caseId: '1',
    caseName: 'Ação de Indenização por Danos Morais',
    date: new Date('2024-04-21T09:45:00'),
    details: 'Revisão da Petição Inicial concluída'
  },
  {
    id: '5',
    type: 'case',
    action: 'Novo caso criado',
    agent: 'Recepcionista',
    caseId: '2',
    caseName: 'Processo Tributário - Impugnação de Débito',
    date: new Date('2024-04-22T10:30:00'),
    details: 'Caso aberto para Empresa ABC Ltda'
  },
  {
    id: '6',
    type: 'document',
    action: 'Documento enviado',
    agent: 'Supervisor',
    caseId: '1',
    caseName: 'Ação de Indenização por Danos Morais',
    date: new Date('2024-04-22T14:20:00'),
    details: 'Petição Inicial enviada ao cliente para revisão'
  },
  {
    id: '7',
    type: 'system',
    action: 'Backup realizado',
    agent: 'Sistema',
    date: new Date('2024-04-22T23:00:00'),
    details: 'Backup automático de todos os dados do sistema'
  },
  {
    id: '8',
    type: 'document',
    action: 'Documento aprovado',
    agent: 'Supervisor',
    caseId: '1',
    caseName: 'Ação de Indenização por Danos Morais',
    date: new Date('2024-04-23T09:15:00'),
    details: 'Petição Inicial aprovada pelo cliente'
  },
  {
    id: '9',
    type: 'case',
    action: 'Caso atualizado',
    agent: 'Pesquisador',
    caseId: '2',
    caseName: 'Processo Tributário - Impugnação de Débito',
    date: new Date('2024-04-23T11:40:00'),
    details: 'Jurisprudências relevantes localizadas'
  },
  {
    id: '10',
    type: 'system',
    action: 'Manutenção programada',
    agent: 'Sistema',
    date: new Date('2024-04-23T22:00:00'),
    details: 'Manutenção programada do sistema concluída'
  },
  {
    id: '11',
    type: 'document',
    action: 'Documento criado',
    agent: 'Redator',
    caseId: '2',
    caseName: 'Processo Tributário - Impugnação de Débito',
    date: new Date('2024-04-24T14:30:00'),
    details: 'Impugnação de débito criada'
  },
  {
    id: '12',
    type: 'case',
    action: 'Prazo adicionado',
    agent: 'Supervisor',
    caseId: '1',
    caseName: 'Ação de Indenização por Danos Morais',
    date: new Date('2024-04-25T10:00:00'),
    details: 'Prazo para contestação adicionado: 15/05/2024'
  },
];

const ActivityHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  
  // Filter activities based on search term and filters
  const filteredActivities = mockActivities
    .filter(activity => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesAction = activity.action.toLowerCase().includes(searchLower);
        const matchesAgent = activity.agent.toLowerCase().includes(searchLower);
        const matchesCase = activity.caseName?.toLowerCase().includes(searchLower);
        const matchesDetails = activity.details?.toLowerCase().includes(searchLower);
        
        if (!(matchesAction || matchesAgent || matchesCase || matchesDetails)) {
          return false;
        }
      }
      
      // Date filter
      if (dateFilter !== 'all') {
        const now = new Date();
        if (dateFilter === 'today') {
          const isToday = activity.date.getDate() === now.getDate() && 
                         activity.date.getMonth() === now.getMonth() && 
                         activity.date.getFullYear() === now.getFullYear();
          if (!isToday) return false;
        } else if (dateFilter === 'week') {
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (activity.date < oneWeekAgo) return false;
        } else if (dateFilter === 'month') {
          const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          if (activity.date < oneMonthAgo) return false;
        }
      }
      
      // Type filter
      if (typeFilter !== 'all' && activity.type !== typeFilter) {
        return false;
      }
      
      return true;
    });
  
  // Sort activities based on sort order
  const sortedActivities = [...filteredActivities].sort((a, b) => {
    if (sortOrder === 'newest') {
      return b.date.getTime() - a.date.getTime();
    } else {
      return a.date.getTime() - b.date.getTime();
    }
  });
  
  // Group activities by date
  const groupActivitiesByDate = (activities: Activity[]) => {
    const grouped: Record<string, Activity[]> = {};
    
    activities.forEach(activity => {
      const dateKey = format(activity.date, 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(activity);
    });
    
    return grouped;
  };
  
  const groupedActivities = groupActivitiesByDate(sortedActivities);
  
  // Type styling
  const getTypeStyles = (type: Activity['type']) => {
    switch(type) {
      case 'document':
        return 'bg-blue-500';
      case 'case':
        return 'bg-green-500';
      case 'system':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getTypeLabel = (type: Activity['type']) => {
    switch(type) {
      case 'document':
        return 'Documento';
      case 'case':
        return 'Caso';
      case 'system':
        return 'Sistema';
      default:
        return 'Outro';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h1 className="text-2xl font-bold text-evji-primary">Histórico de Atividades</h1>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar atividades..." 
                    className="pl-8 w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todo período</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Última semana</SelectItem>
                    <SelectItem value="month">Último mês</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="document">Documentos</SelectItem>
                    <SelectItem value="case">Casos</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                  className="relative"
                  title={sortOrder === 'newest' ? 'Mais recentes primeiro' : 'Mais antigas primeiro'}
                >
                  <ArrowDownWideNarrow className={`h-4 w-4 transition-all ${sortOrder === 'oldest' ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="timeline">
              <TabsList>
                <TabsTrigger value="timeline">
                  <Clock className="h-4 w-4 mr-2" />
                  Linha do Tempo
                </TabsTrigger>
                <TabsTrigger value="list">
                  <FileText className="h-4 w-4 mr-2" />
                  Lista
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="timeline" className="mt-6 space-y-8">
                {Object.keys(groupedActivities).length > 0 ? (
                  Object.entries(groupedActivities).map(([dateKey, activities]) => (
                    <div key={dateKey}>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-px flex-1 bg-border"></div>
                        <h3 className="text-sm font-medium">
                          {format(new Date(dateKey), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </h3>
                        <div className="h-px flex-1 bg-border"></div>
                      </div>
                      
                      <div className="space-y-6">
                        {activities.map((activity) => (
                          <div key={activity.id} className="relative pl-8">
                            <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full ${getTypeStyles(activity.type)} flex items-center justify-center`}>
                              {activity.type === 'document' && <FileText className="h-2 w-2 text-white" />}
                              {activity.type === 'case' && <FileText className="h-2 w-2 text-white" />}
                              {activity.type === 'system' && <User className="h-2 w-2 text-white" />}
                            </div>
                            
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <h4 className="font-medium">{activity.action}</h4>
                                    <Badge variant="outline">
                                      {activity.agent}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {format(activity.date, "HH:mm", { locale: ptBR })}
                                  </div>
                                </div>
                                
                                {activity.caseName && (
                                  <div className="text-sm text-muted-foreground mb-2">
                                    Caso: {activity.caseName}
                                  </div>
                                )}
                                
                                {activity.details && <p className="text-sm">{activity.details}</p>}
                                
                                <div className="mt-2 flex justify-end">
                                  <Button variant="ghost" size="sm" className="h-7">
                                    <Eye className="h-3.5 w-3.5 mr-1" />
                                    Ver detalhes
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Clock className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                    <h3 className="mt-4 text-lg font-medium">Nenhuma atividade encontrada</h3>
                    <p className="mt-2 text-muted-foreground">
                      Nenhuma atividade corresponde aos filtros selecionados.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="list" className="mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Atividades Recentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {sortedActivities.length > 0 ? (
                      <div className="space-y-2">
                        {sortedActivities.map(activity => (
                          <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                            <div className={`w-1 self-stretch rounded-full ${getTypeStyles(activity.type)}`} />
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
                                <h4 className="font-medium">{activity.action}</h4>
                                <div className="text-sm text-muted-foreground">
                                  {format(activity.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </div>
                              </div>
                              {activity.caseName && (
                                <div className="text-sm text-muted-foreground">
                                  Caso: {activity.caseName}
                                </div>
                              )}
                              {activity.details && <p className="text-sm mt-1">{activity.details}</p>}
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {activity.agent}
                                </Badge>
                                <Badge className={`${getTypeStyles(activity.type)} text-xs`}>
                                  {getTypeLabel(activity.type)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                        <h3 className="mt-4 text-lg font-medium">Nenhuma atividade encontrada</h3>
                        <p className="mt-2 text-muted-foreground">
                          Nenhuma atividade corresponde aos filtros selecionados.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ActivityHistory;
