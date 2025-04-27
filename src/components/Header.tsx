
import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { NotificationSystem } from './notification/NotificationSystem';
import { ThemeToggle } from './ThemeToggle';
import { Badge } from './ui/badge';

export function Header() {
  const isDevelopment = import.meta.env.DEV;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 hover-scale">
            <img src="/placeholder.svg" alt="Logo" className="w-8 h-8" />
            <span className="font-serif font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              EVJI
            </span>
          </div>
          {isDevelopment && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800">
              Dev
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <NotificationSystem />
          <ThemeToggle />
          <button className="p-2 rounded-full hover:bg-accent/10 transition-colors">
            <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
}
