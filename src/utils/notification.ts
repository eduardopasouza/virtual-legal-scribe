
import { Notification } from "@/types/notification";

export const formatTime = (date: Date) => {
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

export const getTypeIcon = (type: Notification['type']) => {
  switch(type) {
    case 'info':
      return 'info';
    case 'alert':
      return 'alert-triangle';
    case 'success':
      return 'check';
    case 'warning':
      return 'bell';
    default:
      return 'info';
  }
};
