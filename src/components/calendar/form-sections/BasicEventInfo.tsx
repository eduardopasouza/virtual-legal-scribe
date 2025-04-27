
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormSection } from "./FormSection";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ptBR } from 'date-fns/locale';
import type { Event } from '@/types/calendar';
import { getTypeLabel } from '@/utils/calendar';

interface BasicEventInfoProps {
  event: Omit<Event, 'id'>;
  onEventChange: (event: Omit<Event, 'id'>) => void;
}

export function BasicEventInfo({ event, onEventChange }: BasicEventInfoProps) {
  const [cases, setCases] = useState<Array<{ id: string, number: string, title: string }>>([]);
  
  useEffect(() => {
    // Simple mock data for demonstration purposes
    setCases([
      { id: 'PROC-12345', number: 'PROC-12345', title: 'Processo Civil - João Silva' },
      { id: 'PROC-12346', number: 'PROC-12346', title: 'Processo Trabalhista - Maria Oliveira' },
      { id: 'PROC-12347', number: 'PROC-12347', title: 'Processo Administrativo - Empresa ABC' }
    ]);
  }, []);
  
  return (
    <FormSection>
      <div className="space-y-2">
        <Label htmlFor="title" className="font-medium">Título</Label>
        <Input 
          id="title" 
          value={event.title} 
          onChange={e => onEventChange({...event, title: e.target.value})}
          placeholder="Título do evento"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type" className="font-medium">Tipo</Label>
        <Select 
          value={event.type}
          onValueChange={value => onEventChange({...event, type: value as Event['type']})}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="audiencia">{getTypeLabel('audiencia')}</SelectItem>
            <SelectItem value="prazo">{getTypeLabel('prazo')}</SelectItem>
            <SelectItem value="reuniao">{getTypeLabel('reuniao')}</SelectItem>
            <SelectItem value="outro">{getTypeLabel('outro')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label className="font-medium">Data</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !event.date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {event.date ? format(event.date, "PPP", { locale: ptBR }) : <span>Selecione uma data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
            <Calendar
              mode="single"
              selected={event.date}
              onSelect={(date) => onEventChange({...event, date: date || new Date()})}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="relatedCase" className="font-medium">Processo Relacionado</Label>
        <Select 
          value={event.relatedCase || ""}
          onValueChange={(value) => onEventChange({...event, relatedCase: value || undefined})}
        >
          <SelectTrigger id="relatedCase">
            <SelectValue placeholder="Selecionar processo (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nenhum</SelectItem>
            {cases.map(case_ => (
              <SelectItem key={case_.id} value={case_.number}>
                {case_.number} - {case_.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FormSection>
  );
}
