
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "./FormSection";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import type { Event } from '@/types/calendar';

interface AdditionalDetailsProps {
  event: Omit<Event, 'id'>;
  onEventChange: (event: Omit<Event, 'id'>) => void;
}

export function AdditionalDetails({ event, onEventChange }: AdditionalDetailsProps) {  
  return (
    <FormSection>
      <div className="space-y-2">
        <Label htmlFor="description" className="font-medium">Descrição</Label>
        <Textarea 
          id="description" 
          value={event.description}
          onChange={e => onEventChange({...event, description: e.target.value})}
          placeholder="Detalhes adicionais sobre o evento"
          rows={3}
          required
        />
      </div>
      
      {event.type === 'prazo' && (
        <div className="space-y-2">
          <Label htmlFor="priority" className="font-medium">Prioridade</Label>
          <Select 
            value={event.notificationSettings?.priority || "medium"}
            onValueChange={value => onEventChange({
              ...event, 
              notificationSettings: {
                ...event.notificationSettings,
                priority: value as 'high' | 'medium' | 'low'
              }
            })}
          >
            <SelectTrigger id="priority">
              <SelectValue placeholder="Selecione a prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="notifyBefore" className="font-medium">Notificar com antecedência</Label>
        <Select 
          value={String(event.notificationSettings?.notifyBefore || 1)}
          onValueChange={value => onEventChange({
            ...event, 
            notificationSettings: {
              ...event.notificationSettings,
              notifyBefore: parseInt(value)
            }
          })}
        >
          <SelectTrigger id="notifyBefore">
            <SelectValue placeholder="Selecione quando notificar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">No dia</SelectItem>
            <SelectItem value="1">1 dia antes</SelectItem>
            <SelectItem value="2">2 dias antes</SelectItem>
            <SelectItem value="3">3 dias antes</SelectItem>
            <SelectItem value="7">1 semana antes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </FormSection>
  );
}
