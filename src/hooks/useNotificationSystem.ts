
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Notification } from '@/types/notification';

export function useNotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  useEffect(() => {
    if (unreadCount > 0) {
      setHasNewNotification(true);
      const timer = setTimeout(() => setHasNewNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);
  
  const addNotification = (
    type: 'info' | 'alert' | 'success' | 'warning', 
    title: string, 
    message: string, 
    category: 'case' | 'deadline' | 'document' | 'system' = 'system'
  ) => {
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
    
    // Only use Sonner for toast notifications
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

  return {
    notifications,
    hasNewNotification,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  };
}
