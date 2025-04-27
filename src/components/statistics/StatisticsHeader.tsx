
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileBarChart, Calendar as CalendarIcon } from 'lucide-react';
import { TimeRange } from '@/types/statistics';

interface StatisticsHeaderProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  onExport: () => void;
}

export const StatisticsHeader = ({ selectedRange, onRangeChange, onExport }: StatisticsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Estatísticas Avançadas</h1>
        <p className="text-muted-foreground">Análise e métricas detalhadas do EVJI</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Select 
          value={selectedRange} 
          onValueChange={(value) => onRangeChange(value as TimeRange)}
        >
          <SelectTrigger className="w-[140px]">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Última semana</SelectItem>
            <SelectItem value="month">Último mês</SelectItem>
            <SelectItem value="quarter">Último trimestre</SelectItem>
            <SelectItem value="year">Último ano</SelectItem>
            <SelectItem value="all">Todo o período</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>
    </div>
  );
};
