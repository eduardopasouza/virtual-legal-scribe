import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { NotificationSystem } from './notification/NotificationSystem';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/placeholder.svg" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-lg">EVJI</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationSystem />
          <ThemeToggle />
          <button className="p-2 rounded-full hover:bg-accent">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
