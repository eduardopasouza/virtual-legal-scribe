
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Users, 
  BarChart2, 
  Calendar as CalendarIcon, 
  Settings, 
  Search, 
  Clock, 
  MessageSquare 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function SidebarNav() {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'Casos', path: '/cases/list' },
    { icon: Users, label: 'Clientes', path: '/clients' },
    { icon: BarChart2, label: 'Estatísticas', path: '/stats' },
    { icon: CalendarIcon, label: 'Calendário', path: '/calendar' },
    { icon: Clock, label: 'Histórico', path: '/history' },
    { icon: Search, label: 'Busca', path: '/search' },
    { icon: MessageSquare, label: 'Assistente', path: '/chatbot' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <div className="space-y-2 w-full">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Tooltip key={item.path}>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant={isActive ? 'secondary' : 'ghost'}
                size="icon"
                className={cn(
                  'w-full flex justify-start gap-3 h-10 px-3',
                  isActive 
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <Link to={item.path} className="flex items-center">
                  <item.icon className="h-5 w-5" />
                  <span className="ml-2 hidden md:inline-flex">{item.label}</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {item.label}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
