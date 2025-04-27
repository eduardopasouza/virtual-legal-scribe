
import React from 'react';
import { Notification } from '@/types/notification';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, FileText, AlertTriangle, Calendar, Info, X, Bell, Briefcase } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onRemove,
}: NotificationItemProps) {
  const getIcon = () => {
    if (notification.category === 'document') return <FileText className="h-5 w-5 flex-shrink-0" />;
    if (notification.category === 'deadline') return <Calendar className="h-5 w-5 flex-shrink-0" />;
    if (notification.category === 'case') return <Briefcase className="h-5 w-5 flex-shrink-0" />;
    
    switch (notification.type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" />;
      case 'success':
        return <Check className="h-5 w-5 flex-shrink-0 text-green-500" />;
      default:
        return <Info className="h-5 w-5 flex-shrink-0 text-blue-500" />;
    }
  };

  const getTypeColor = () => {
    switch (notification.type) {
      case 'alert':
        return 'border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-amber-500 bg-amber-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const handleClick = () => {
    if (notification.url) {
      window.location.href = notification.url;
    }
    onMarkAsRead(notification.id);
  };

  const timeAgo = formatDistance(
    new Date(notification.timestamp),
    new Date(),
    { addSuffix: true, locale: ptBR }
  );

  return (
    <div 
      className={`
        p-3 border-l-4 ${getTypeColor()} ${!notification.read ? 'bg-opacity-20' : 'bg-opacity-10'} 
        ${notification.url ? 'cursor-pointer' : ''} hover:bg-opacity-30 transition-all
      `}
      onClick={notification.url ? handleClick : undefined}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className={`font-medium text-sm ${!notification.read ? 'font-semibold' : ''}`}>
              {notification.title}
            </h4>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {timeAgo}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(notification.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remover notificação</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <p className="text-xs mt-1">{notification.message}</p>
          {!notification.read && (
            <div className="flex justify-end mt-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs px-2 py-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
              >
                Marcar como lida
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
