
import React, { useState } from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Search, X, Tag, SlidersHorizontal, User } from 'lucide-react';
import { ClientFilter } from '@/types/client';

interface ClientsFilterProps {
  filter: ClientFilter;
  onFilterChange: (filter: Partial<ClientFilter>) => void;
}

export const ClientsFilter = ({ filter, onFilterChange }: ClientsFilterProps) => {
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [tags, setTags] = useState<string[]>(filter.tags || []);
  const [tagInput, setTagInput] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleStatusChange = (value: string | null) => {
    onFilterChange({ status: value });
  };

  const handleTypeChange = (value: string | null) => {
    onFilterChange({ type: value });
  };

  const handleLawyerChange = (value: string | null) => {
    onFilterChange({ responsibleLawyer: value });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      onFilterChange({ tags: newTags });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter(t => t !== tag);
    setTags(newTags);
    onFilterChange({ tags: newTags });
  };

  const clearAllFilters = () => {
    setTags([]);
    onFilterChange({
      search: '',
      status: null,
      type: null,
      tags: [],
      responsibleLawyer: null
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <TabsList>
          <TabsTrigger value="todos" onClick={() => handleStatusChange(null)}>
            Todos
          </TabsTrigger>
          <TabsTrigger value="ativos" onClick={() => handleStatusChange('active')}>
            Ativos
          </TabsTrigger>
          <TabsTrigger value="inativos" onClick={() => handleStatusChange('inactive')}>
            Inativos
          </TabsTrigger>
          <TabsTrigger value="pendentes" onClick={() => handleStatusChange('pending')}>
            Pendentes
          </TabsTrigger>
        </TabsList>
        
        <div className="flex w-full sm:w-auto space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar clientes..." 
              className="pl-8"
              value={filter.search}
              onChange={handleSearchChange}
            />
          </div>
          <Popover open={isAdvancedFilterOpen} onOpenChange={setIsAdvancedFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <h4 className="font-medium">Filtros Avançados</h4>
                
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Tipo de Cliente</label>
                  <Select
                    value={filter.type || ""}
                    onValueChange={value => handleTypeChange(value === "" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
                      <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Advogado Responsável</label>
                  <Select 
                    value={filter.responsibleLawyer || ""}
                    onValueChange={value => handleLawyerChange(value === "" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o advogado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="1">Dr. João Silva</SelectItem>
                      <SelectItem value="2">Dra. Maria Oliveira</SelectItem>
                      <SelectItem value="3">Dr. Carlos Santos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Adicionar tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                  </div>
                </div>
                
                <div className="pt-2 flex justify-between">
                  <Button variant="outline" size="sm" onClick={clearAllFilters}>
                    Limpar Filtros
                  </Button>
                  <Button size="sm" onClick={() => setIsAdvancedFilterOpen(false)}>
                    Aplicar
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Indicadores de filtros ativos */}
      {(filter.status || filter.type || filter.responsibleLawyer || filter.tags.length > 0) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          
          {filter.status && (
            <Badge variant="outline" className="flex items-center gap-1">
              Status: {filter.status === 'active' ? 'Ativo' : filter.status === 'inactive' ? 'Inativo' : 'Pendente'}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleStatusChange(null)} />
            </Badge>
          )}
          
          {filter.type && (
            <Badge variant="outline" className="flex items-center gap-1">
              Tipo: {filter.type === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleTypeChange(null)} />
            </Badge>
          )}
          
          {filter.responsibleLawyer && (
            <Badge variant="outline" className="flex items-center gap-1">
              Advogado: {filter.responsibleLawyer}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleLawyerChange(null)} />
            </Badge>
          )}
          
          {filter.tags.map(tag => (
            <Badge key={tag} variant="outline" className="flex items-center gap-1">
              Tag: {tag}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
            </Badge>
          ))}
          
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={clearAllFilters}>
            Limpar Todos
          </Button>
        </div>
      )}
    </div>
  );
};
