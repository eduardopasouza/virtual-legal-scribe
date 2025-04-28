
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import SidebarNav from "@/components/SidebarNav";
import { useMobileContext } from '@/hooks/use-mobile';

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const { sidebarOpen, isMobile } = useMobileContext();
  
  // If we're on mobile and the sidebar isn't open, don't render anything
  if (isMobile && !sidebarOpen) return null;

  return (
    <div className={`h-full border-r bg-background flex flex-col ${collapsed ? 'w-16' : 'w-60'} transition-all duration-300`}>
      <div className="p-4 border-b">
        <h2 className={`font-medium text-lg truncate ${collapsed ? 'text-center text-xs' : ''}`}>
          {collapsed ? 'EVJI' : 'EVJI Legal'}
        </h2>
      </div>
      
      <ScrollArea className="flex-1">
        <SidebarNav isCollapsed={collapsed} />
      </ScrollArea>
    </div>
  );
}
