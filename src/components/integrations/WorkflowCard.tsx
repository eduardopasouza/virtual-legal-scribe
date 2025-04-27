
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { N8nWorkflow } from '@/types/integrations';
import { Loader2, Calendar, FileText, Mail, AlertCircle } from 'lucide-react';

interface WorkflowCardProps {
  workflow: N8nWorkflow;
  onUpdate: (id: string, data: Partial<N8nWorkflow>) => void;
  onExecute: (id: string) => Promise<void>;
  onEdit?: (id: string) => void;
}

export function WorkflowCard({
  workflow,
  onUpdate,
  onExecute,
  onEdit
}: WorkflowCardProps) {
  const [isExecuting, setIsExecuting] = React.useState(false);

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      await onExecute(workflow.id);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleToggleActive = () => {
    onUpdate(workflow.id, { active: !workflow.active });
  };

  const getWorkflowIcon = () => {
    if (workflow.name.toLowerCase().includes('email')) {
      return <Mail className="h-5 w-5 text-blue-500" />;
    } else if (workflow.name.toLowerCase().includes('calendar')) {
      return <Calendar className="h-5 w-5 text-green-500" />;
    } else if (workflow.name.toLowerCase().includes('document')) {
      return <FileText className="h-5 w-5 text-orange-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getWorkflowTriggerLabel = () => {
    switch (workflow.triggerType) {
      case 'webhook':
        return 'Gatilho por webhook';
      case 'scheduler':
        return 'Agendado';
      case 'manual':
        return 'Execução manual';
      default:
        return 'Gatilho desconhecido';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {getWorkflowIcon()}
            <CardTitle className="text-lg font-medium">{workflow.name}</CardTitle>
          </div>
          <Badge 
            variant={workflow.active ? 'default' : 'outline'}
            className="flex items-center gap-1"
          >
            {workflow.active ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
        <CardDescription>{workflow.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="text-sm">
          <span className="font-medium">Tipo de gatilho:</span> {getWorkflowTriggerLabel()}
        </div>
        
        {workflow.webhookUrl && (
          <div className="text-sm break-all">
            <span className="font-medium">URL do Webhook:</span>
            <div className="bg-muted p-2 rounded-md mt-1 text-xs font-mono">
              {workflow.webhookUrl}
            </div>
          </div>
        )}

        {workflow.lastExecuted && (
          <div className="text-xs text-muted-foreground">
            Última execução: {new Date(workflow.lastExecuted).toLocaleString()}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Switch 
            id={`active-${workflow.id}`}
            checked={workflow.active}
            onCheckedChange={handleToggleActive}
          />
          <label htmlFor={`active-${workflow.id}`} className="text-sm font-medium">
            {workflow.active ? 'Ativado' : 'Desativado'}
          </label>
        </div>

        <div className="flex space-x-2">
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleExecute} 
            disabled={isExecuting || !workflow.active}
          >
            {isExecuting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executando...
              </>
            ) : (
              'Executar'
            )}
          </Button>
          
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(workflow.id)}
            >
              Editar
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
