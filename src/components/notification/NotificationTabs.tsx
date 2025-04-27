
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NotificationTabsProps {
  activeTab: string;
}

export function NotificationTabs({ activeTab }: NotificationTabsProps) {
  return (
    <TabsList className="w-full justify-start px-4 py-2 bg-muted/30">
      <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
      <TabsTrigger value="case" className="text-xs">Casos</TabsTrigger>
      <TabsTrigger value="document" className="text-xs">Documentos</TabsTrigger>
      <TabsTrigger value="deadline" className="text-xs">Prazos</TabsTrigger>
      <TabsTrigger value="system" className="text-xs">Sistema</TabsTrigger>
    </TabsList>
  );
}
