
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Users, 
  BarChart2, 
  Calendar as CalendarIcon, 
  Settings, 
  Search, 
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarNavProps {
  isCollapsed?: boolean;
}

export function SidebarNav({ isCollapsed = false }: SidebarNavProps) {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: FileText, label: 'Casos', path: '/cases/list' },
    { icon: Users, label: 'Clientes', path: '/clients' },
    { icon: BarChart2, label: 'Estatísticas', path: '/stats' },
    { icon: CalendarIcon, label: 'Calendário', path: '/calendar' },
    { icon: Clock, label: 'Histórico', path: '/history' },
    { icon: Search, label: 'Busca', path: '/search' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  return (
    <div className="space-y-2 w-full py-4">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || 
                         (item.path === '/cases/list' && location.pathname.includes('/cases/'));
        
        const buttonContent = (
          <Button
            key={item.path}
            asChild
            variant={isActive ? 'secondary' : 'ghost'}
            size="sm"
            className={cn(
              'w-full flex items-center h-10 transition-all duration-200',
              isCollapsed ? 'justify-center px-0' : 'justify-start gap-3 px-3',
              isActive 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm scale-[1.02]' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:scale-[1.01]'
            )}
          >
            <NavLink to={item.path} className="flex items-center w-full">
              <item.icon className={cn(
                "h-5 w-5 transition-transform", 
                !isCollapsed && 'mr-2',
                isActive && 'scale-110'
              )} />
              {!isCollapsed && (
                <span className="font-medium truncate">{item.label}</span>
              )}
            </NavLink>
          </Button>
        );
        
        return isCollapsed ? (
          <TooltipProvider key={item.path} delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                {buttonContent}
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-sidebar-accent text-sidebar-accent-foreground">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : buttonContent;
      })}
    </div>
  );
}
