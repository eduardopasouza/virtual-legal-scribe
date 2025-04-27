
import React, { useState, useEffect } from 'react';
import SidebarNav from '@/components/SidebarNav';
import { Separator } from "@/components/ui/separator";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useMobileContext } from '@/hooks/use-mobile';

export function Sidebar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const { isMobile } = useMobileContext();
  
  // Function to expand the sidebar on hover
  const handleMouseEnter = () => {
    if (!isPinned && !isMobile) {
      setIsCollapsed(false);
    }
  };
  
  // Function to collapse the sidebar when mouse leaves
  const handleMouseLeave = () => {
    if (!isPinned && !isMobile) {
      setIsCollapsed(true);
    }
  };
  
  // Function to toggle pin/unpin of the sidebar
  const togglePin = () => {
    setIsPinned(!isPinned);
    setIsCollapsed(isPinned); // If unpinning, collapse; if pinning, keep current state
  };
  
  // Effect to set initial state on page load or window resize
  useEffect(() => {
    if (!isPinned) {
      setIsCollapsed(true);
    }
  }, [isPinned]);
  
  return (
    <div className="relative h-full flex">
      <aside 
        className={cn(
          "h-full border-r border-border bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-300",
          isCollapsed && !isMobile ? "w-16" : "w-64"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={cn("p-6 flex items-center", isCollapsed && !isMobile && "justify-center p-3")}>
          <Link to="/" className="font-serif text-xl font-bold flex items-center hover:text-evji-accent transition-colors">
            {isCollapsed && !isMobile ? (
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
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <SidebarNav isCollapsed={isCollapsed && !isMobile} />
        </nav>
        
        <div className="p-4 mt-auto">
          <Separator className="bg-sidebar-border mb-4" />
          <div className="space-y-1">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full justify-start gap-3 text-evji-accent/90",
                isCollapsed && !isMobile && "justify-center px-0"
              )}
              onClick={() => navigate('/login')}
            >
              <LogOut className="h-5 w-5" />
              {(!isCollapsed || isMobile) && <span>Sair</span>}
            </Button>
          </div>
        </div>
      </aside>
      
      {!isMobile && (
        <Button 
          variant="ghost" 
          size="sm"
          className={cn(
            "absolute -right-3 top-20 h-6 w-6 p-0 rounded-full border shadow-md bg-background z-10",
            isPinned && "bg-evji-accent/20"
          )}
          onClick={togglePin}
          aria-label={isPinned ? 'Desafixar menu' : 'Fixar menu'}
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          <span className="sr-only">
            {isPinned ? 'Desafixar menu' : 'Fixar menu'}
          </span>
        </Button>
      )}
    </div>
  );
}
