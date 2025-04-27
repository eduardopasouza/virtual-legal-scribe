
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { Notification } from '@/types/notification';
import { NotificationContent } from './NotificationContent';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function NotificationSystem() {
  const { toast: showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Novo Caso',
      message: 'Um novo caso foi atribuído a você',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      read: false,
      type: 'info',
      category: 'case'
    },
    {
      id: '2',
      title: 'Documento Analisado',
      message: 'A análise do documento "Petição Inicial" foi concluída',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
      type: 'success',
      category: 'document'
    },
    {
      id: '3',
      title: 'Prazo Importante',
      message: 'Recurso do caso #2487 deve ser apresentado em 3 dias',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      read: false,
      type: 'alert',
      category: 'deadline'
    },
    {
      id: '4',
      title: 'Atualização do Sistema',
      message: 'O sistema será atualizado amanhã às 22:00h',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
      type: 'warning',
      category: 'system'
    }
  ]);
  
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  
  useEffect(() => {
    if (unreadCount > 0) {
      setHasNewNotification(true);
      const timer = setTimeout(() => setHasNewNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);
  
  const addNotification = (type: 'info' | 'alert' | 'success' | 'warning', title: string, message: string, category: 'case' | 'deadline' | 'document' | 'system' = 'system') => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      timestamp: new Date(),
      read: false,
      type,
      category
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    let variant: "default" | "destructive" | undefined = "default";
    if (type === 'alert') variant = "destructive";
    
    showToast({
      title,
      description: message,
      variant,
    });
    
    toast[type === 'alert' ? 'error' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'](
      title,
      {
        description: message,
      }
    );
    
    setHasNewNotification(true);
    setTimeout(() => setHasNewNotification(false), 3000);
    
    return newNotification;
  };
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };
  
  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className={cn(
              "h-5 w-5 transition-all", 
              hasNewNotification && "animate-bounce text-primary"
            )} />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[350px] p-0" align="end">
          <NotificationContent
            notifications={notifications}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onMarkAsRead={markAsRead}
            onRemove={removeNotification}
            onClearAll={clearAllNotifications}
            onMarkAllAsRead={markAllAsRead}
            unreadCount={unreadCount}
          />
        </PopoverContent>
      </Popover>
      
      {(window as any).addNotification = addNotification}
    </>
  );
}

export function useNotifications() {
  const addNotification = (type: 'info' | 'alert' | 'success' | 'warning', title: string, message: string, category?: 'case' | 'deadline' | 'document' | 'system') => {
    if ((window as any).addNotification) {
      return (window as any).addNotification(type, title, message, category);
    }
    return null;
  };
  
  return { addNotification };
}
