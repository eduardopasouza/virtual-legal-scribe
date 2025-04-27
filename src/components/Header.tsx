
import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { NotificationSystem } from './notification/NotificationSystem';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="bg-background border-b border-border h-14 flex items-center px-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/placeholder.svg" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-lg">EVJI</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <NotificationSystem />
          <button className="p-2 rounded-full hover:bg-accent">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
