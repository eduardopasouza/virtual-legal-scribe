
import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface SearchFiltersProps {
  documentFilters: Record<string, boolean>;
  caseFilters: Record<string, boolean>;
  dateFilter: string;
  onFilterChange: (type: string, key: string, value: boolean) => void;
  onDateFilterChange: (value: string) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export function SearchFilters({
  documentFilters,
  caseFilters,
  dateFilter,
  onFilterChange,
  onDateFilterChange,
  onClearFilters,
  onApplyFilters
}: SearchFiltersProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-medium">Filtros</h4>
      <Separator />
      
      <div className="space-y-2">
        <h5 className="text-sm font-medium">Tipos de Documento</h5>
        <div className="space-y-2">
          <FilterCheckbox
            id="filter-petitions"
            label="Petições"
            checked={documentFilters.petitions}
            onCheckedChange={(checked) => onFilterChange('documentFilters', 'petitions', checked === true)}
          />
          <FilterCheckbox
            id="filter-contracts"
            label="Contratos"
            checked={documentFilters.contracts}
            onCheckedChange={(checked) => onFilterChange('documentFilters', 'contracts', checked === true)}
          />
          <FilterCheckbox
            id="filter-appeals"
            label="Recursos" 
            checked={documentFilters.appeals}
            onCheckedChange={(checked) => onFilterChange('documentFilters', 'appeals', checked === true)}
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <h5 className="text-sm font-medium">Status do Caso</h5>
        <div className="space-y-2">
          <FilterCheckbox
            id="filter-active"
            label="Em andamento"
            checked={caseFilters.active}
            onCheckedChange={(checked) => onFilterChange('caseFilters', 'active', checked === true)}
          />
          <FilterCheckbox
            id="filter-concluded"
            label="Concluídos"
            checked={caseFilters.concluded}
            onCheckedChange={(checked) => onFilterChange('caseFilters', 'concluded', checked === true)}
          />
          <FilterCheckbox
            id="filter-archived"
            label="Arquivados"
            checked={caseFilters.archived}
            onCheckedChange={(checked) => onFilterChange('caseFilters', 'archived', checked === true)}
          />
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-2">
        <h5 className="text-sm font-medium">Data</h5>
        <div className="grid grid-cols-2 gap-2">
          <DateFilterButton active={dateFilter === 'all'} value="all" onClick={onDateFilterChange}>
            Todas
          </DateFilterButton>
          <DateFilterButton active={dateFilter === 'month'} value="month" onClick={onDateFilterChange}>
            Último mês
          </DateFilterButton>
          <DateFilterButton active={dateFilter === 'quarter'} value="quarter" onClick={onDateFilterChange}>
            Último trimestre
          </DateFilterButton>
          <DateFilterButton active={dateFilter === 'year'} value="year" onClick={onDateFilterChange}>
            Último ano
          </DateFilterButton>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          Limpar filtros
        </Button>
        <Button size="sm" onClick={onApplyFilters}>Aplicar</Button>
      </div>
    </div>
  );
}

interface FilterCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean | "indeterminate") => void;
}

function FilterCheckbox({ id, label, checked, onCheckedChange }: FilterCheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

interface DateFilterButtonProps {
  active: boolean;
  value: string;
  onClick: (value: string) => void;
  children: React.ReactNode;
}

function DateFilterButton({ active, value, onClick, children }: DateFilterButtonProps) {
  return (
    <Button 
      variant={active ? 'default' : 'outline'} 
      size="sm"
      className="w-full"
      onClick={() => onClick(value)}
    >
      {children}
    </Button>
  );
}
