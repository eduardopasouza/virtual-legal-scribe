
import React from 'react';
import { Search, Calendar, Filter, ArrowDownWideNarrow } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ActivityFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
}

export function ActivityFilters({
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter,
  typeFilter,
  setTypeFilter,
  sortOrder,
  setSortOrder
}: ActivityFiltersProps) {
  return (
    <div className="flex items-center flex-wrap gap-2">
      <div className="relative grow md:grow-0">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar atividades..." 
          className="pl-8 w-full md:w-[200px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Select value={dateFilter} onValueChange={setDateFilter}>
        <SelectTrigger className="w-[130px]">
          <Calendar className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todo período</SelectItem>
          <SelectItem value="today">Hoje</SelectItem>
          <SelectItem value="week">Última semana</SelectItem>
          <SelectItem value="month">Último mês</SelectItem>
          <SelectItem value="quarter">Último trimestre</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="w-[130px]">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="document">Documentos</SelectItem>
          <SelectItem value="case">Casos</SelectItem>
          <SelectItem value="system">Sistema</SelectItem>
          <SelectItem value="deadline">Prazos</SelectItem>
        </SelectContent>
      </Select>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
        className="relative"
        title={sortOrder === 'newest' ? 'Mais recentes primeiro' : 'Mais antigas primeiro'}
      >
        <ArrowDownWideNarrow className={`h-4 w-4 transition-all ${sortOrder === 'oldest' ? 'rotate-180' : ''}`} />
      </Button>
    </div>
  );
}
