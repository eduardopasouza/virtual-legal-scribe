
import React from 'react';
import { Button } from '@/components/ui/button';

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
    <div className="flex items-center justify-between p-4 border-b">
      <h3 className="font-medium">Notificações</h3>
      <div className="flex gap-2">
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-8"
            onClick={onMarkAllAsRead}
          >
            Ler tudo
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-8"
          onClick={onClearAll}
        >
          Limpar
        </Button>
      </div>
    </div>
  );
}
