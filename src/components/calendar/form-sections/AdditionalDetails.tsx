
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Event } from '@/types/calendar'

interface AdditionalDetailsProps {
  event: Omit<Event, 'id'>;
  onEventChange: (event: Omit<Event, 'id'>) => void;
}

export function AdditionalDetails({ event, onEventChange }: AdditionalDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="relatedCase">Processo Relacionado (opcional)</Label>
        <Input 
          id="relatedCase" 
          value={event.relatedCase || ''}
          onChange={e => onEventChange({...event, relatedCase: e.target.value})}
          placeholder="Número do processo ou nome do caso"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea 
          id="description" 
          value={event.description}
          onChange={e => onEventChange({...event, description: e.target.value})}
          placeholder="Detalhes adicionais sobre o evento"
          rows={3}
        />
      </div>
    </div>
  );
}
