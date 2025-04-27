
import React from 'react';
import { SidebarNav } from '@/components/SidebarNav';
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from 'react-router-dom';

export function Sidebar() {
  const navigate = useNavigate();
  
  return (
    <aside className="h-full w-64 border-r border-border bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="p-6">
        <Link to="/" className="font-serif text-xl font-bold flex items-center hover:text-evji-accent transition-colors">
          <span className="text-evji-accent">EVJI</span>
          <span className="text-xs ml-2 bg-evji-accent/20 text-evji-accent px-2 py-0.5 rounded">v1.0</span>
        </Link>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <nav className="flex-1 p-4">
        <SidebarNav />
      </nav>
      
      <div className="p-4 mt-auto">
        <Separator className="bg-sidebar-border mb-4" />
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-evji-accent/90"
            onClick={() => navigate('/login')}
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </div>
    </aside>
  );
}
