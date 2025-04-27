
import React from 'react';
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function SystemGuide() {
  const [openGuide, setOpenGuide] = React.useState(false);
  
  return (
    <Collapsible
      open={openGuide}
      onOpenChange={setOpenGuide}
      className="border rounded-lg p-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl font-medium text-evji-primary flex items-center gap-2">
          <Info className="h-5 w-5 text-evji-accent" />
          Como funciona o sistema EVJI
        </h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {openGuide ? "Fechar" : "Expandir"}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="mt-4 space-y-4">
        <p className="text-muted-foreground">
          O sistema EVJI foi projetado para otimizar o fluxo de trabalho jurídico através
          da coordenação de agentes de IA especializados que trabalham em conjunto para analisar,
          processar e preparar documentação legal.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-3">
            <h4 className="font-medium mb-2">Fluxo de Trabalho</h4>
            <ol className="list-decimal ml-4 text-sm space-y-1">
              <li>Cadastro do caso e upload de documentos</li>
              <li>Análise de fatos e requisitos pelo Analista de Fatos</li>
              <li>Elaboração de estratégia pelo Estrategista</li>
              <li>Redação de documentos pelo Redator</li>
              <li>Revisão legal pelo Revisor Legal</li>
            </ol>
          </div>
          
          <div className="border rounded p-3">
            <h4 className="font-medium mb-2">Principais Recursos</h4>
            <ul className="list-disc ml-4 text-sm space-y-1">
              <li>Orquestração de agentes de IA especializados</li>
              <li>Análise automática de documentos</li>
              <li>Geração assistida de peças processuais</li>
              <li>Comunicação simplificada com clientes</li>
              <li>Dashboard analítico para acompanhamento</li>
            </ul>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
