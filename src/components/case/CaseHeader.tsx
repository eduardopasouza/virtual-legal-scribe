
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CaseHeaderProps {
  title: string;
  type: string; // We handle this at the CaseDetailsContent level
  status: string;
  createdAt: Date;
}

export function CaseHeader({ title, type, status, createdAt }: CaseHeaderProps) {
  const { toast } = useToast();
  
  const handleShareCase = () => {
    toast({
      title: "Link compartilhável copiado",
      description: "O link para este caso foi copiado para a área de transferência",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-evji-primary">{title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{type}</Badge>
            <Badge 
              className={status === 'Em andamento' ? 'bg-amber-500' : 'bg-green-500'}
            >
              {status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Aberto em {format(createdAt, 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShareCase}>
            Compartilhar
          </Button>
          <Button size="sm">Ações</Button>
        </div>
      </div>
      <Separator className="my-4" />
    </div>
  );
}
