
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineEvent {
  id: number;
  title: string;
  description: string;
  time: string;
  status: 'completed' | 'current' | 'pending';
}

export function WorkflowTimeline() {
  const events: TimelineEvent[] = [
    {
      id: 1,
      title: "Recepção do Documento",
      description: "Documento recebido e registrado no sistema",
      time: "09:30",
      status: 'completed'
    },
    {
      id: 2,
      title: "Análise de Documentos",
      description: "Extração e indexação do conteúdo relevante",
      time: "09:45",
      status: 'completed'
    },
    {
      id: 3,
      title: "Planejamento Estratégico",
      description: "Definição da abordagem e objetivos processuais",
      time: "10:15",
      status: 'current'
    },
    {
      id: 4,
      title: "Pesquisa Jurídica",
      description: "Busca por legislação e jurisprudência aplicáveis",
      time: "--:--",
      status: 'pending'
    },
    {
      id: 5,
      title: "Redação",
      description: "Elaboração da peça usando metodologia FIRAC",
      time: "--:--",
      status: 'pending'
    },
    {
      id: 6,
      title: "Revisão e QA",
      description: "Verificação de qualidade e checklist final",
      time: "--:--",
      status: 'pending'
    }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fluxo de Trabalho</CardTitle>
        <CardDescription>
          Acompanhe o progresso do caso em tempo real.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4 ml-6">
          {events.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Timeline connector */}
              {index < events.length - 1 && (
                <div className="timeline-line" />
              )}
              
              {/* Event point and content */}
              <div className="flex gap-4 items-start">
                <div className={`timeline-dot ${
                  event.status === 'completed' ? 'bg-green-500' : 
                  event.status === 'current' ? 'bg-blue-500 animate-pulse' : 
                  'bg-gray-300'
                }`} />
                
                <div className="pb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm">{event.title}</h3>
                    <span className="text-xs text-muted-foreground">{event.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
