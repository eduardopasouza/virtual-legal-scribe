
import React from 'react';
import { Notification } from '@/types/notification';
import { NotificationItem } from './NotificationItem';
import { BellOff } from 'lucide-react';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onRemove,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
        <BellOff className="h-8 w-8 mb-2 opacity-50" />
        <p>Nenhuma notificação</p>
      </div>
    );
  }

  return (
    <div className="max-h-[300px] overflow-y-auto">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
