
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Filter } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchFilters } from './SearchFilters';

interface SearchInputProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  filters: {
    documentFilters: Record<string, boolean>;
    caseFilters: Record<string, boolean>;
    dateFilter: string;
  };
  onFilterChange: (type: string, key: string, value: boolean) => void;
  onDateFilterChange: (value: string) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export function SearchInput({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  filters,
  onFilterChange,
  onDateFilterChange,
  onClearFilters,
  onApplyFilters
}: SearchInputProps) {
  return (
    <form onSubmit={onSearchSubmit} className="flex items-center gap-2">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Busque por documentos, casos, clientes..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          autoFocus
        />
      </div>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Filter className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <SearchFilters 
            documentFilters={filters.documentFilters}
            caseFilters={filters.caseFilters}
            dateFilter={filters.dateFilter}
            onFilterChange={onFilterChange}
            onDateFilterChange={onDateFilterChange}
            onClearFilters={onClearFilters}
            onApplyFilters={onApplyFilters}
          />
        </PopoverContent>
      </Popover>
      
      <Button type="submit">Buscar</Button>
    </form>
  );
}
