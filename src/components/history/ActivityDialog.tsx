
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, Calendar, Clock, User, FileCheck, AlertTriangle } from 'lucide-react';
import { Activity } from '@/types/history';

interface ActivityDialogProps {
  activity: Activity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ActivityDialog({ activity, open, onOpenChange }: ActivityDialogProps) {
  if (!activity) {
    return null;
  }

  const getTypeStyles = (type: Activity['type']) => {
    switch(type) {
      case 'document':
        return 'bg-blue-500 text-white';
      case 'case':
        return 'bg-green-500 text-white';
      case 'system':
        return 'bg-purple-500 text-white';
      case 'deadline':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-gray-500 text-white';
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
      case 'deadline':
        return 'Prazo';
      default:
        return 'Outro';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("criado") || action.includes("novo")) {
      return <FileText className="h-4 w-4 mr-2" />;
    } else if (action.includes("aprovado") || action.includes("concluído")) {
      return <FileCheck className="h-4 w-4 mr-2" />;
    } else if (action.includes("erro") || action.includes("falha")) {
      return <AlertTriangle className="h-4 w-4 mr-2" />;
    } else {
      return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {getActionIcon(activity.action)}
            {activity.action}
          </DialogTitle>
          <DialogDescription>
            Detalhes completos da atividade
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Badge className={getTypeStyles(activity.type)}>
              {getTypeLabel(activity.type)}
            </Badge>
            <Badge variant="outline">{activity.agent}</Badge>
          </div>

          {activity.caseName && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Caso:</span> {activity.caseName}
              {activity.caseId && (
                <span className="text-xs text-muted-foreground">({activity.caseId})</span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Data:</span> {format(activity.date, "dd/MM/yyyy", { locale: ptBR })}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Hora:</span> {format(activity.date, "HH:mm:ss", { locale: ptBR })}
          </div>

          <div className="flex items-start gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <span className="font-medium">Agente:</span> {activity.agent}
              <p className="text-muted-foreground mt-1 text-xs">
                Agente responsável pela ação executada
              </p>
            </div>
          </div>

          {activity.details && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Detalhes da atividade</h4>
              <p className="text-sm whitespace-pre-line border-l-2 border-muted pl-3 py-2">
                {activity.details}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          {activity.caseId && (
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Ver caso
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
