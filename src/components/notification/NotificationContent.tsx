
import React from 'react';
import { Button } from '@/components/ui/button';
import { Notification } from '@/types/notification';
import { NotificationHeader } from './NotificationHeader';
import { NotificationTabs } from './NotificationTabs';
import { NotificationList } from './NotificationList';
import { 
  Tabs, 
  TabsContent, 
} from "@/components/ui/tabs";

interface NotificationContentProps {
  notifications: Notification[];
  activeTab: string;
  onTabChange: (value: string) => void;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onMarkAllAsRead: () => void;
  unreadCount: number;
}

export function NotificationContent({
  notifications,
  activeTab,
  onTabChange,
  onMarkAsRead,
  onRemove,
  onClearAll,
  onMarkAllAsRead,
  unreadCount,
}: NotificationContentProps) {
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === activeTab);

  return (
    <>
      <NotificationHeader
        unreadCount={unreadCount}
        onMarkAllAsRead={onMarkAllAsRead}
        onClearAll={onClearAll}
      />
      
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <NotificationTabs activeTab={activeTab} />
        
        <TabsContent value={activeTab} className="mt-0">
          <NotificationList
            notifications={filteredNotifications}
            onMarkAsRead={onMarkAsRead}
            onRemove={onRemove}
          />
        </TabsContent>
      </Tabs>
      
      <div className="p-2 border-t">
        <Button variant="outline" size="sm" className="w-full text-xs">
          Ver todas as notificações
        </Button>
      </div>
    </>
  );
}
