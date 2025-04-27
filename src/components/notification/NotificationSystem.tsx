
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { NotificationContent } from './NotificationContent';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function NotificationSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const {
    notifications,
    hasNewNotification,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    addNotification
  } = useNotificationSystem();

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className={`h-5 w-5 transition-all ${hasNewNotification ? "animate-bounce text-primary" : ""}`} />
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
