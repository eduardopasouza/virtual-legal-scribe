
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Eye } from 'lucide-react';
import { Activity } from '@/types/history';

interface ActivityItemProps {
  activity: Activity;
  variant: 'timeline' | 'list';
  onViewDetails?: (activity: Activity) => void;
}

export function ActivityItem({ activity, variant, onViewDetails }: ActivityItemProps) {
  const getTypeStyles = (type: Activity['type']) => {
    switch(type) {
      case 'document':
        return 'bg-blue-500';
      case 'case':
        return 'bg-green-500';
      case 'system':
        return 'bg-purple-500';
      case 'deadline':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
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
  
  const getTypeIcon = (type: Activity['type']) => {
    switch(type) {
      case 'document':
        return <FileText className="h-2 w-2 text-white" />;
      case 'case':
        return <FileText className="h-2 w-2 text-white" />;
      case 'system':
        return <User className="h-2 w-2 text-white" />;
      default:
        return null;
    }
  };
  
  if (variant === 'timeline') {
    return (
      <div className="relative pl-8">
        <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full ${getTypeStyles(activity.type)} flex items-center justify-center`}>
          {getTypeIcon(activity.type)}
        </div>
        
        <div className="p-4 border rounded-md hover:bg-muted/50 transition-colors shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h4 className="font-medium">{activity.action}</h4>
              <Badge variant="outline">
                {activity.agent}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              {format(activity.date, "HH:mm", { locale: ptBR })}
            </div>
          </div>
          
          {activity.caseName && (
            <div className="text-sm text-muted-foreground mb-2">
              Caso: {activity.caseName}
            </div>
          )}
          
          {activity.details && <p className="text-sm">{activity.details}</p>}
          
          <div className="mt-2 flex justify-end">
            {onViewDetails && (
              <Button variant="ghost" size="sm" className="h-7" onClick={() => onViewDetails(activity)}>
                <Eye className="h-3.5 w-3.5 mr-1" />
                Ver detalhes
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-start gap-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
      <div className={`w-1 self-stretch rounded-full ${getTypeStyles(activity.type)}`} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
          <h4 className="font-medium">{activity.action}</h4>
          <div className="text-sm text-muted-foreground">
            {format(activity.date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
        </div>
        {activity.caseName && (
          <div className="text-sm text-muted-foreground">
            Caso: {activity.caseName}
          </div>
        )}
        {activity.details && <p className="text-sm mt-1">{activity.details}</p>}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            {activity.agent}
          </Badge>
          <Badge className={`${getTypeStyles(activity.type)} text-xs`}>
            {getTypeLabel(activity.type)}
          </Badge>
        </div>
      </div>
    </div>
  );
}
