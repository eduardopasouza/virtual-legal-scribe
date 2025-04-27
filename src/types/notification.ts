
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
