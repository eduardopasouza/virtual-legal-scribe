
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowStage } from '@/types/case';
import { format, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CaseTimelineProps {
  stages: WorkflowStage[];
}

export function CaseTimeline({ stages }: CaseTimelineProps) {
  // Sort stages by stage_number if not already sorted
  const sortedStages = [...stages].sort((a, b) => a.stage_number - b.stage_number);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500 animate-pulse';
      default:
        return 'bg-gray-300';
    }
  };

  const getStageName = (name: string) => {
    switch (name) {
      case 'reception':
        return 'Recepção e Triagem';
      case 'planning':
        return 'Planejamento Estratégico';
      case 'analysis':
        return 'Análise Jurídica';
      case 'research':
        return 'Pesquisa e Fundamentação';
      case 'drafting':
        return 'Elaboração de Documento';
      case 'review':
        return 'Verificação e Revisão';
      case 'delivery':
        return 'Entrega e Feedback';
      default:
        return name;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Linha do tempo do caso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4 ml-6 pb-4">
          {sortedStages.map((stage, index) => (
            <div key={stage.id} className="relative">
              {/* Timeline connector */}
              {index < sortedStages.length - 1 && (
                <div className="absolute top-6 left-1.5 bottom-0 w-0.5 bg-gray-200" />
              )}
              
              {/* Event point and content */}
              <div className="flex gap-4 items-start">
                <div 
                  className={`h-4 w-4 rounded-full mt-1.5 ${getStatusColor(stage.status)}`}
                  style={{ zIndex: 1 }}
                />
                
                <div className="pb-6">
                  <h3 className="font-medium text-sm">{getStageName(stage.stage_name)}</h3>
                  
                  <div className="text-xs text-muted-foreground mt-1">
                    {stage.status === 'completed' && stage.completed_at && (
                      <p>
                        Concluído em {format(new Date(stage.completed_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        {stage.started_at && (
                          <> (duração: {formatDistance(
                            new Date(stage.completed_at),
                            new Date(stage.started_at),
                            { locale: ptBR }
                          )})</>
                        )}
                      </p>
                    )}
                    
                    {stage.status === 'in_progress' && stage.started_at && (
                      <p>
                        Iniciado em {format(new Date(stage.started_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        <> (em andamento há {formatDistance(
                          new Date(),
                          new Date(stage.started_at),
                          { locale: ptBR, addSuffix: false }
                        )})</>
                      </p>
                    )}
                    
                    {stage.status === 'pending' && (
                      <p>Aguardando início</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
