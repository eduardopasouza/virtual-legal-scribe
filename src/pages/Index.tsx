
import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/DashboardStats';
import { QuickAccess } from '@/components/dashboard/QuickAccess';
import { OngoingActivities } from '@/components/dashboard/OngoingActivities';
import { SystemGuide } from '@/components/dashboard/SystemGuide';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { WebChat } from '@/components/WebChat';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { FileText, Clock, AlertTriangle, Check } from "lucide-react";
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useCases } from '@/hooks/useCases';

const Index = () => {
  const { cases, stats, isLoading } = useCases();
  
  // Welcome message that appears automatically
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.info(
        'Bem-vindo ao EVJI',
        {
          description: 'Seu assistente jurídico inteligente está pronto para ajudar. Utilize o chat para começar.',
          duration: 7000,
        }
      );
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter cases by status
  const activeCases = cases?.filter(c => c.status === 'em_andamento') || [];
  const completedCases = cases?.filter(c => c.status === 'concluido') || [];
  const archivedCases = cases?.filter(c => c.status === 'arquivado') || [];

  return (
    <DashboardLayout>
      <DashboardHeader />
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Assistente EVJI</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] p-0">
              <WebChat fullScreen={false} />
            </CardContent>
          </Card>
          
          {/* Cases Management Section */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Casos Ativos</CardTitle>
                <Link to="/cases">
                  <Button variant="outline" size="sm">
                    Ver Todos
                  </Button>
                </Link>
              </div>
              <CardDescription>Casos jurídicos em andamento</CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-14 bg-gray-200 rounded-lg"></div>
                  <div className="h-14 bg-gray-200 rounded-lg"></div>
                  <div className="h-14 bg-gray-200 rounded-lg"></div>
                </div>
              ) : activeCases.length > 0 ? (
                <div className="space-y-3">
                  {activeCases.slice(0, 5).map((caseItem) => (
                    <Link key={caseItem.id} to={`/cases/${caseItem.id}`}>
                      <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-evji-primary/20 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-evji-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{caseItem.title}</h4>
                            <p className="text-xs text-muted-foreground">{caseItem.client} • {caseItem.type || 'Caso Geral'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {new Date(caseItem.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>Nenhum caso ativo no momento.</p>
                  <Link to="/novo-caso">
                    <Button variant="outline" className="mt-2">
                      Criar Novo Caso
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {/* Completed Cases */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Casos Concluídos</CardTitle>
                  <div className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    {completedCases.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                ) : completedCases.length > 0 ? (
                  <div className="space-y-2">
                    {completedCases.slice(0, 3).map((caseItem) => (
                      <Link key={caseItem.id} to={`/cases/${caseItem.id}`}>
                        <div className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <p className="text-sm font-medium truncate max-w-[180px]">{caseItem.title}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-sm text-muted-foreground">
                    Nenhum caso concluído
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Archived Cases */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Casos Arquivados</CardTitle>
                  <div className="bg-gray-100 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    {archivedCases.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                    <div className="h-10 bg-gray-200 rounded-lg"></div>
                  </div>
                ) : archivedCases.length > 0 ? (
                  <div className="space-y-2">
                    {archivedCases.slice(0, 3).map((caseItem) => (
                      <Link key={caseItem.id} to={`/cases/${caseItem.id}`}>
                        <div className="flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            <p className="text-sm font-medium truncate max-w-[180px]">{caseItem.title}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-sm text-muted-foreground">
                    Nenhum caso arquivado
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          
          <OngoingActivities />
          <SystemGuide />
        </div>
        <div className="space-y-4 lg:space-y-6">
          <DashboardSidebar />
          <QuickAccess />
        </div>
      </div>
      <Sonner />
    </DashboardLayout>
  );
};

export default Index;
