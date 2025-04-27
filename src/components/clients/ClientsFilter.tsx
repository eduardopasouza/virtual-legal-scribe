
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

interface ClientsFilterProps {
  onFilterChange: (status: string | null) => void;
  onSearchChange: (term: string) => void;
  searchTerm: string;
}

export const ClientsFilter = ({ onFilterChange, onSearchChange, searchTerm }: ClientsFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <TabsList>
        <TabsTrigger value="todos" onClick={() => onFilterChange(null)}>
          Todos
        </TabsTrigger>
        <TabsTrigger value="ativos" onClick={() => onFilterChange('active')}>
          Ativos
        </TabsTrigger>
        <TabsTrigger value="inativos" onClick={() => onFilterChange('inactive')}>
          Inativos
        </TabsTrigger>
        <TabsTrigger value="pendentes" onClick={() => onFilterChange('pending')}>
          Pendentes
        </TabsTrigger>
      </TabsList>
      
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar clientes..." 
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};
