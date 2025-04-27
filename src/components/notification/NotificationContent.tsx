
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Notification } from '@/types/notification';
import { NotificationItem } from './NotificationItem';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
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
      
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="w-full justify-start px-4 py-2 bg-muted/30">
          <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
          <TabsTrigger value="case" className="text-xs">Casos</TabsTrigger>
          <TabsTrigger value="document" className="text-xs">Documentos</TabsTrigger>
          <TabsTrigger value="deadline" className="text-xs">Prazos</TabsTrigger>
          <TabsTrigger value="system" className="text-xs">Sistema</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <ScrollArea className="h-[300px]">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
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
