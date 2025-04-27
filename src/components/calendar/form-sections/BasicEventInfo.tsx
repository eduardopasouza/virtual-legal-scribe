
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Event } from '@/types/calendar'

interface BasicEventInfoProps {
  event: Omit<Event, 'id'>;
  onEventChange: (event: Omit<Event, 'id'>) => void;
}

export function BasicEventInfo({ event, onEventChange }: BasicEventInfoProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input 
          id="title" 
          value={event.title} 
          onChange={e => onEventChange({...event, title: e.target.value})}
          placeholder="Título do evento"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Data</Label>
          <div className="flex items-center h-10 rounded-md border border-input px-3 py-2">
            {event.date.toLocaleDateString()}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select 
            value={event.type}
            onValueChange={value => onEventChange({...event, type: value as Event['type']})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="audiencia">Audiência</SelectItem>
              <SelectItem value="prazo">Prazo</SelectItem>
              <SelectItem value="reuniao">Reunião</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
