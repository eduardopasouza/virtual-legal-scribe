
import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileBarChart, Calendar as CalendarIcon } from 'lucide-react';
import { LineChart, BarChart, PieChart, Line, Bar, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const casesByMonth = [
  { month: 'Jan', novos: 5, concluidos: 3 },
  { month: 'Fev', novos: 8, concluidos: 4 },
  { month: 'Mar', novos: 10, concluidos: 7 },
  { month: 'Abr', novos: 7, concluidos: 9 },
  { month: 'Mai', novos: 12, concluidos: 8 },
  { month: 'Jun', novos: 9, concluidos: 11 },
  { month: 'Jul', novos: 11, concluidos: 10 },
  { month: 'Ago', novos: 13, concluidos: 12 },
  { month: 'Set', novos: 15, concluidos: 13 },
  { month: 'Out', novos: 11, concluidos: 14 },
  { month: 'Nov', novos: 10, concluidos: 9 },
  { month: 'Dez', novos: 8, concluidos: 7 },
];

const casesPerType = [
  { tipo: 'Cível', quantidade: 35 },
  { tipo: 'Trabalhista', quantidade: 25 },
  { tipo: 'Tributário', quantidade: 18 },
  { tipo: 'Penal', quantidade: 12 },
  { tipo: 'Administrativo', quantidade: 10 },
];

const COLORS = ['#1a365d', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

const agentPerformance = [
  { agent: 'Recepcionista', casos: 42, tempoMedio: 1.2 },
  { agent: 'Analisador', casos: 38, tempoMedio: 2.5 },
  { agent: 'Estrategista', casos: 35, tempoMedio: 3.1 },
  { agent: 'Pesquisador', casos: 32, tempoMedio: 2.8 },
  { agent: 'Redator', casos: 28, tempoMedio: 4.2 },
  { agent: 'Revisor', casos: 26, tempoMedio: 1.9 },
];

const timelineData = [
  { data: '2024-01', tempoMedio: 6.3 },
  { data: '2024-02', tempoMedio: 5.8 },
  { data: '2024-03', tempoMedio: 5.2 },
  { data: '2024-04', tempoMedio: 4.7 },
  { data: '2024-05', tempoMedio: 4.3 },
  { data: '2024-06', tempoMedio: 3.9 },
  { data: '2024-07', tempoMedio: 3.5 },
  { data: '2024-08', tempoMedio: 3.2 },
];

const AdvancedStats = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-evji-primary">Estatísticas Avançadas</h1>
                <p className="text-muted-foreground">Análise detalhada do desempenho do EVJI</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Select defaultValue="2024">
                  <SelectTrigger className="w-[120px]">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total de Casos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">132</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">+12%</span> em relação ao ano anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.5 dias</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">-15%</span> em relação ao ano anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">+4%</span> em relação ao ano anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Custo por Caso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 350</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500">-8%</span> em relação ao ano anterior
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="geral">
              <TabsList>
                <TabsTrigger value="geral">
                  <FileBarChart className="h-4 w-4 mr-2" />
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="casos">Casos</TabsTrigger>
                <TabsTrigger value="agentes">Agentes</TabsTrigger>
                <TabsTrigger value="tempo">Tempo</TabsTrigger>
              </TabsList>
              
              <TabsContent value="geral" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Casos por Mês</CardTitle>
                      <CardDescription>
                        Comparativo de casos novos vs. concluídos
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={casesByMonth}
                          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="novos" name="Novos Casos" fill="#1a365d" />
                          <Bar dataKey="concluidos" name="Casos Concluídos" fill="#d4af37" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Distribuição por Tipo</CardTitle>
                      <CardDescription>
                        Casos por área do direito
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={casesPerType}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="quantidade"
                            label={({ tipo, percent }) => `${tipo} ${(percent * 100).toFixed(0)}%`}
                          >
                            {casesPerType.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">Desempenho dos Agentes</CardTitle>
                      <CardDescription>
                        Comparativo de casos processados e tempo médio por agente
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={agentPerformance}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="agent" />
                          <YAxis yAxisId="left" orientation="left" stroke="#1a365d" />
                          <YAxis yAxisId="right" orientation="right" stroke="#d4af37" />
                          <Tooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="casos" name="Casos Processados" fill="#1a365d" />
                          <Bar yAxisId="right" dataKey="tempoMedio" name="Tempo Médio (horas)" fill="#d4af37" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="casos">
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Análise de Casos</CardTitle>
                    <CardDescription>
                      Detalhamento dos casos processados pelo EVJI
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Status dos Casos</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-4 bg-muted rounded-md">
                            <div className="text-2xl font-bold">72</div>
                            <div className="text-sm text-muted-foreground">Em andamento</div>
                          </div>
                          <div className="p-4 bg-muted rounded-md">
                            <div className="text-2xl font-bold">45</div>
                            <div className="text-sm text-muted-foreground">Concluídos</div>
                          </div>
                          <div className="p-4 bg-muted rounded-md">
                            <div className="text-2xl font-bold">15</div>
                            <div className="text-sm text-muted-foreground">Arquivados</div>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-medium pt-4">Complexidade dos Casos</h3>
                        <div className="h-[220px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Baixa', valor: 45 },
                                  { name: 'Média', valor: 65 },
                                  { name: 'Alta', valor: 22 },
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="valor"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                <Cell fill="#60a5fa" />
                                <Cell fill="#3b82f6" />
                                <Cell fill="#1a365d" />
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Resultados dos Casos</h3>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { tipo: 'Ganhos', civel: 22, trabalhista: 18, tributario: 7, penal: 5 },
                                { tipo: 'Parciais', civel: 8, trabalhista: 5, tributario: 4, penal: 3 },
                                { tipo: 'Perdidos', civel: 5, trabalhista: 2, tributario: 1, penal: 2 },
                              ]}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="tipo" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="civel" name="Cível" fill="#1a365d" />
                              <Bar dataKey="trabalhista" name="Trabalhista" fill="#3b82f6" />
                              <Bar dataKey="tributario" name="Tributário" fill="#60a5fa" />
                              <Bar dataKey="penal" name="Penal" fill="#93c5fd" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="agentes">
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Desempenho de Agentes</CardTitle>
                    <CardDescription>
                      Análise detalhada do desempenho de cada agente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Taxa de Precisão</h3>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              layout="vertical"
                              data={[
                                { nome: 'Recepcionista', precisao: 95 },
                                { nome: 'Analisador', precisao: 92 },
                                { nome: 'Estrategista', precisao: 89 },
                                { nome: 'Pesquisador', precisao: 94 },
                                { nome: 'Redator', precisao: 91 },
                                { nome: 'Revisor', precisao: 97 },
                                { nome: 'Supervisor', precisao: 99 },
                              ]}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" domain={[80, 100]} />
                              <YAxis dataKey="nome" type="category" />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="precisao" name="Precisão (%)" fill="#1a365d" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Volume de Processamento</h3>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={[
                                { mes: 'Jan', recepcionista: 15, analisador: 12, estrategista: 10, pesquisador: 8, redator: 6, revisor: 5 },
                                { mes: 'Fev', recepcionista: 18, analisador: 14, estrategista: 12, pesquisador: 9, redator: 7, revisor: 6 },
                                { mes: 'Mar', recepcionista: 20, analisador: 18, estrategista: 15, pesquisador: 12, redator: 10, revisor: 9 },
                                { mes: 'Abr', recepcionista: 22, analisador: 19, estrategista: 16, pesquisador: 14, redator: 12, revisor: 10 },
                                { mes: 'Mai', recepcionista: 25, analisador: 22, estrategista: 18, pesquisador: 15, redator: 13, revisor: 12 },
                                { mes: 'Jun', recepcionista: 28, analisador: 25, estrategista: 20, pesquisador: 17, redator: 15, revisor: 13 },
                              ]}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="mes" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="recepcionista" name="Recepcionista" stroke="#1a365d" />
                              <Line type="monotone" dataKey="analisador" name="Analisador" stroke="#2563eb" />
                              <Line type="monotone" dataKey="estrategista" name="Estrategista" stroke="#3b82f6" />
                              <Line type="monotone" dataKey="pesquisador" name="Pesquisador" stroke="#60a5fa" />
                              <Line type="monotone" dataKey="redator" name="Redator" stroke="#93c5fd" />
                              <Line type="monotone" dataKey="revisor" name="Revisor" stroke="#bfdbfe" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="tempo">
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Análise de Tempo</CardTitle>
                    <CardDescription>
                      Métricas de tempo de processamento de casos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Tendência de Tempo</h3>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={timelineData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="data" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="tempoMedio" 
                                name="Tempo Médio (dias)" 
                                stroke="#1a365d" 
                                strokeWidth={2} 
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Tempo por Tipo de Caso</h3>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { tipo: 'Cível', tempoMedio: 3.8 },
                                { tipo: 'Trabalhista', tempoMedio: 2.5 },
                                { tipo: 'Tributário', tempoMedio: 4.2 },
                                { tipo: 'Penal', tempoMedio: 5.1 },
                                { tipo: 'Administrativo', tempoMedio: 2.9 },
                              ]}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="tipo" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar 
                                dataKey="tempoMedio" 
                                name="Tempo Médio (dias)" 
                                fill="#1a365d" 
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      
                      <div className="lg:col-span-2">
                        <h3 className="text-lg font-medium">Distribuição de Tempo por Etapa do Fluxo de Trabalho</h3>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[
                                { tipo: 'Recepção', simples: 0.2, medio: 0.3, complexo: 0.5 },
                                { tipo: 'Análise', simples: 0.5, medio: 1.0, complexo: 1.8 },
                                { tipo: 'Estratégia', simples: 0.3, medio: 0.7, complexo: 1.2 },
                                { tipo: 'Pesquisa', simples: 0.4, medio: 0.9, complexo: 1.5 },
                                { tipo: 'Redação', simples: 0.6, medio: 1.2, complexo: 2.1 },
                                { tipo: 'Revisão', simples: 0.3, medio: 0.5, complexo: 0.8 },
                                { tipo: 'Finalização', simples: 0.2, medio: 0.3, complexo: 0.4 },
                              ]}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="tipo" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="simples" name="Caso Simples (dias)" stackId="a" fill="#60a5fa" />
                              <Bar dataKey="medio" name="Caso Médio (dias)" stackId="a" fill="#3b82f6" />
                              <Bar dataKey="complexo" name="Caso Complexo (dias)" stackId="a" fill="#1a365d" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
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

export default AdvancedStats;
