
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Notification } from '@/types/notification';
import { NotificationItem } from './NotificationItem';

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
  return (
    <ScrollArea className="h-[300px]">
      {notifications.length > 0 ? (
        <div className="divide-y">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onRemove={onRemove}
            />
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-muted-foreground">
          Nenhuma notificação
        </div>
      )}
    </ScrollArea>
  );
}
