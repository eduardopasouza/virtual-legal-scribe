
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Notification } from '@/types/notification';
import { formatTime, getTypeIcon } from '@/utils/notification';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

export function NotificationItem({ notification, onMarkAsRead, onRemove }: NotificationItemProps) {
  const IconComponent = Icons[getTypeIcon(notification.type) as keyof typeof Icons] as LucideIcon;

  return (
    <div className={`p-4 hover:bg-muted/50 transition-colors ${notification.read ? 'bg-transparent' : 'bg-muted/30'}`}>
      <div className="flex justify-between mb-1">
        <h4 className="text-sm font-medium flex items-center gap-1">
          <IconComponent className="h-4 w-4" />
          {notification.title}
        </h4>
        <span className="text-xs text-muted-foreground">
          {formatTime(notification.timestamp)}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
      <div className="flex justify-end gap-2">
        {notification.url && (
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 text-xs" 
            onClick={() => {
              window.location.href = notification.url || '#';
              onMarkAsRead(notification.id);
            }}
          >
            Ver detalhes
          </Button>
        )}
        {!notification.read && (
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-7 w-7 p-0" 
            onClick={() => onMarkAsRead(notification.id)}
          >
            <Check className="h-4 w-4" />
            <span className="sr-only">Marcar como lido</span>
          </Button>
        )}
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-7 w-7 p-0" 
          onClick={() => onRemove(notification.id)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Remover</span>
        </Button>
      </div>
    </div>
  );
}
