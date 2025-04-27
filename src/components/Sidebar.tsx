
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  FileText,
  Clock,
  Users,
  FolderOpen,
  Settings,
  HelpCircle,
  LogOut
} from "lucide-react";

export function Sidebar() {
  return (
    <aside className="h-full w-64 border-r border-border bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="p-6">
        <h2 className="font-serif text-xl font-bold flex items-center">
          <span className="text-evji-accent">EVJI</span>
          <span className="text-xs ml-2 bg-evji-accent/20 text-evji-accent px-2 py-0.5 rounded">v1.0</span>
        </h2>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3 bg-sidebar-accent text-sidebar-accent-foreground">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <FileText className="h-5 w-5" />
            Documentos
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Clock className="h-5 w-5" />
            Histórico
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Users className="h-5 w-5" />
            Agentes
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <FolderOpen className="h-5 w-5" />
            Repositório
          </Button>
        </div>
      </nav>
      
      <div className="p-4 mt-auto">
        <Separator className="bg-sidebar-border mb-4" />
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Settings className="h-5 w-5" />
            Configurações
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <HelpCircle className="h-5 w-5" />
            Ajuda
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-evji-accent/90">
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </div>
    </aside>
  );
}
