
import React, { useState } from 'react';
import { SidebarNav } from '@/components/SidebarNav';
import { Separator } from "@/components/ui/separator";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <div className="relative h-full flex">
      <aside className={cn(
        "h-full border-r border-border bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <div className={cn("p-6 flex items-center", isCollapsed && "justify-center p-3")}>
          <Link to="/" className="font-serif text-xl font-bold flex items-center hover:text-evji-accent transition-colors">
            {isCollapsed ? (
              <span className="text-evji-accent">E</span>
            ) : (
              <>
                <span className="text-evji-accent">EVJI</span>
                <span className="text-xs ml-2 bg-evji-accent/20 text-evji-accent px-2 py-0.5 rounded">v1.0</span>
              </>
            )}
          </Link>
        </div>
        
        <Separator className="bg-sidebar-border" />
        
        <nav className="flex-1 p-4 overflow-hidden">
          <SidebarNav isCollapsed={isCollapsed} />
        </nav>
        
        <div className="p-4 mt-auto">
          <Separator className="bg-sidebar-border mb-4" />
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start gap-3 text-evji-accent/90",
                isCollapsed && "justify-center px-0"
              )}
              onClick={() => navigate('/login')}
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && <span>Sair</span>}
            </Button>
          </div>
        </div>
      </aside>
      
      <Button 
        variant="ghost" 
        size="sm"
        className="absolute -right-3 top-20 h-6 w-6 p-0 rounded-full border shadow-md bg-background z-10"
        onClick={toggleSidebar}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        <span className="sr-only">
          {isCollapsed ? 'Expandir menu' : 'Recolher menu'}
        </span>
      </Button>
    </div>
  );
}
