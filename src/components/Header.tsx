
import React from 'react';
import { Button } from "@/components/ui/button";
import { Bell, Settings, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Header() {
  return (
    <header className="border-b border-border bg-card py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="font-serif text-2xl font-bold text-evji-primary">EVJI</h1>
          <Separator orientation="vertical" className="h-6" />
          <span className="text-sm text-muted-foreground">Escritório Virtual Jurídico Inteligente</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium">Dr. Usuário</p>
              <p className="text-xs text-muted-foreground">Advogado</p>
            </div>
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
