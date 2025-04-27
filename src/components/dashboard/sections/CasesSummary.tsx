
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Clock, Check, AlertTriangle } from "lucide-react";
import { Link } from 'react-router-dom';

interface Case {
  id: string;
  title: string;
  client: string;
  type?: string;
  created_at: string;
  status: string;
}

interface CasesSummaryProps {
  activeCases: Case[];
  completedCases: Case[];
  archivedCases: Case[];
  isLoading: boolean;
}

export function CasesSummary({ activeCases, completedCases, archivedCases, isLoading }: CasesSummaryProps) {
  return (
    <>
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
    </>
  );
}
