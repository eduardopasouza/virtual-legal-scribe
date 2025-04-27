import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, AlertTriangle } from "lucide-react";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useDeadlines } from '@/hooks/useDeadlines';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

export function CaseDeadlines({ caseId, caseName }: { caseId?: string, caseName?: string }) {
  const { deadlines, isLoading, createDeadline } = useDeadlines(caseId);
  const [showDialog, setShowDialog] = useState(false);
  const [newDeadline, setNewDeadline] = useState({
    description: '',
    date: new Date(),
  });

  const handleCreateDeadline = () => {
    if (!caseId) return;
    
    createDeadline.mutate({
      case_id: caseId,
      description: newDeadline.description,
      date: format(newDeadline.date, 'yyyy-MM-dd'),
      status: 'pendente'
    }, {
      onSuccess: () => {
        setShowDialog(false);
        setNewDeadline({
          description: '',
          date: new Date(),
        });
        toast({
          title: "Prazo adicionado",
          description: "O prazo foi salvo com sucesso e adicionado ao calendário"
        });
      }
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
          <CardTitle className="text-md font-semibold">Prazos</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setShowDialog(true)}>
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            Adicionar
          </Button>
        </CardHeader>
        <CardContent className="px-4 pb-3">
          {isLoading ? (
            <div className="text-sm text-muted-foreground py-2">Carregando prazos...</div>
          ) : deadlines && deadlines.length > 0 ? (
            <ul className="space-y-2">
              {deadlines.map((deadline) => {
                const deadlineDate = new Date(deadline.date);
                const isPast = deadlineDate < new Date();
                const isToday = deadlineDate.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0);
                
                return (
                  <li 
                    key={deadline.id} 
                    className={cn(
                      "flex items-start space-x-2 p-2 text-sm border rounded-md",
                      isPast && deadline.status === 'pendente' ? "bg-red-50 border-red-200" :
                      isToday ? "bg-amber-50 border-amber-200" : "bg-card"
                    )}
                  >
                    <div className="mt-0.5">
                      {isPast && deadline.status === 'pendente' ? (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{deadline.description}</p>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(deadline.date), 'dd/MM/yyyy')}
                        </span>
                        <Badge 
                          variant={deadlineStatus(deadline.status).variant} 
                          className="ml-2 px-1 py-0 text-[10px]"
                        >
                          {deadlineStatus(deadline.status).label}
                        </Badge>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-sm text-muted-foreground py-2">Nenhum prazo cadastrado</div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Prazo</DialogTitle>
            <DialogDescription>
              Adicione um novo prazo para este processo.
              Este prazo será sincronizado com o calendário.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={newDeadline.description}
                onChange={(e) => setNewDeadline({...newDeadline, description: e.target.value})}
                placeholder="Ex: Entrega da contestação"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !newDeadline.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newDeadline.date ? format(newDeadline.date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={newDeadline.date}
                    onSelect={(date) => setNewDeadline({...newDeadline, date: date || new Date()})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateDeadline}
              disabled={!newDeadline.description || createDeadline.isPending}
            >
              {createDeadline.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function deadlineStatus(status: string) {
  switch(status) {
    case 'concluido':
      return { label: 'Concluído', variant: 'default' as const };
    case 'atrasado':
      return { label: 'Atrasado', variant: 'destructive' as const };
    case 'pendente':
    default:
      return { label: 'Pendente', variant: 'outline' as const };
  }
}
