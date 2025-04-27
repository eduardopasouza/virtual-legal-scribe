
import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'alert' | 'success' | 'warning';
  category?: 'case' | 'deadline' | 'document' | 'system';
  url?: string;
  relatedId?: string;
}

export function NotificationSystem() {
  const { toast: showToast } = useToast();
  
  // Exemplo de notificações
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
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === activeTab);
  
  // Efeito para animar o sino quando chegam novas notificações
  useEffect(() => {
    if (unreadCount > 0) {
      setHasNewNotification(true);
      const timer = setTimeout(() => setHasNewNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);
  
  // Função para adicionar nova notificação e exibir toast
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
    
    // Mostrar toast com cores diferentes dependendo do tipo
    let variant: "default" | "destructive" | undefined = "default";
    if (type === 'alert') variant = "destructive";
    
    showToast({
      title,
      description: message,
      variant,
    });
    
    // Mostrar toast com Sonner também (UI mais moderna)
    toast[type === 'alert' ? 'error' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info'](
      title,
      {
        description: message,
      }
    );
    
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
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  const getTypeIcon = (type: Notification['type']) => {
    switch(type) {
      case 'info':
        return <Info size={16} className="text-blue-500" />;
      case 'alert':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'warning':
        return <Clock size={16} className="text-amber-500" />;
      default:
        return <Info size={16} className="text-gray-500" />;
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
        <PopoverContent className="w-[350px] p-0" align="end">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">Notificações</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-8"
                  onClick={markAllAsRead}
                >
                  Ler tudo
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-8"
                onClick={clearAllNotifications}
              >
                Limpar
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                      <div 
                        key={notification.id} 
                        className={`p-4 hover:bg-muted/50 transition-colors ${notification.read ? 'bg-transparent' : 'bg-muted/30'}`}
                      >
                        <div className="flex justify-between mb-1">
                          <h4 className="text-sm font-medium flex items-center gap-1">
                            {getTypeIcon(notification.type)}
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
                                markAsRead(notification.id);
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
            </TabsContent>
          </Tabs>
          
          <div className="p-2 border-t">
            <Button variant="outline" size="sm" className="w-full text-xs">
              Ver todas as notificações
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Exportando a função para que possa ser usada por outros componentes */}
      {(window as any).addNotification = addNotification}
    </>
  );
}

// Função para expor o sistema de notificações globalmente
export function useNotifications() {
  const addNotification = (type: 'info' | 'alert' | 'success' | 'warning', title: string, message: string, category?: 'case' | 'deadline' | 'document' | 'system') => {
    if ((window as any).addNotification) {
      return (window as any).addNotification(type, title, message, category);
    }
    return null;
  };
  
  return { addNotification };
}
