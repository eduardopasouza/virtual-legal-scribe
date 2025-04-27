
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCheck, Trash2 } from 'lucide-react';

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export function NotificationHeader({
  unreadCount,
  onMarkAllAsRead,
  onClearAll,
}: NotificationHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-3">
      <div>
        <h3 className="font-medium">Notificações</h3>
        {unreadCount > 0 ? (
          <p className="text-xs text-muted-foreground">{unreadCount} não lida{unreadCount !== 1 ? 's' : ''}</p>
        ) : (
          <p className="text-xs text-muted-foreground">Nenhuma notificação não lida</p>
        )}
      </div>
      <div className="flex gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onMarkAllAsRead} 
          title="Marcar todas como lidas"
          disabled={unreadCount === 0}
        >
          <CheckCheck className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClearAll} 
          title="Limpar notificações"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
