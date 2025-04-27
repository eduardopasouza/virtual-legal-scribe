
import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Info } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'alert' | 'success';
}

export function NotificationSystem() {
  const { toast } = useToast();
  // Exemplo de notificações
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Novo Caso',
      message: 'Um novo caso foi atribuído a você',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      read: false,
      type: 'info'
    },
    {
      id: '2',
      title: 'Documento Analisado',
      message: 'A análise do documento "Petição Inicial" foi concluída',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
      type: 'success'
    },
    {
      id: '3',
      title: 'Prazo Importante',
      message: 'Recurso do caso #2487 deve ser apresentado em 3 dias',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      read: false,
      type: 'alert'
    }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Efeito para animar o sino quando chegam novas notificações
  useEffect(() => {
    if (unreadCount > 0) {
      setHasNewNotification(true);
      const timer = setTimeout(() => setHasNewNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);
  
  // Adiciona uma notificação de demonstração (para uso com botão de simulação)
  const addDemoNotification = (type: 'info' | 'alert' | 'success', title: string, message: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      timestamp: new Date(),
      read: false,
      type
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    toast({
      title: title,
      description: message,
    });
    
    // Anima o sino
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
  
  const getTypeStyles = (type: Notification['type']) => {
    switch(type) {
      case 'info':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'alert':
        return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20';
      case 'success':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 1000 * 60) {
      return 'Agora mesmo';
    } else if (diff < 1000 * 60 * 60) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} min atrás`;
    } else if (diff < 1000 * 60 * 60 * 24) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      return `${hours}h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
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
        <PopoverContent className="w-80 p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">Notificações</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-8"
                onClick={markAllAsRead}
              >
                Marcar tudo como lido
              </Button>
            )}
          </div>
          
          <ScrollArea className="h-[300px]">
            {notifications.length > 0 ? (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 ${notification.read ? 'bg-transparent' : 'bg-muted/30'}`}
                  >
                    <div className="flex justify-between mb-1">
                      <h4 className="text-sm font-medium flex items-center gap-1">
                        {notification.type === 'info' && <Info size={12} className="text-blue-500" />}
                        {notification.type === 'alert' && <Bell size={12} className="text-amber-500" />}
                        {notification.type === 'success' && <Check size={12} className="text-green-500" />}
                        {notification.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <div className="flex justify-end gap-2">
                      {!notification.read && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 w-7 p-0" 
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Marcar como lido</span>
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 w-7 p-0" 
                        onClick={() => removeNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remover</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Nenhuma notificação
              </div>
            )}
          </ScrollArea>
          
          <div className="p-2 border-t">
            <Button variant="outline" size="sm" className="w-full text-xs">
              Ver todas as notificações
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Exportando a função para que possa ser usada por outros componentes */}
      {(window as any).addNotification = addDemoNotification}
    </>
  );
}

// Função para expor o sistema de notificações globalmente
export function useNotifications() {
  const addNotification = (type: 'info' | 'alert' | 'success', title: string, message: string) => {
    if ((window as any).addNotification) {
      return (window as any).addNotification(type, title, message);
    }
    return null;
  };
  
  return { addNotification };
}
