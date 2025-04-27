
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { Event } from '@/types/calendar'

interface TimeSelectionProps {
  event: Omit<Event, 'id'>;
  onEventChange: (event: Omit<Event, 'id'>) => void;
}

export function TimeSelection({ event, onEventChange }: TimeSelectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="startTime">Hora de Início</Label>
        <Input 
          id="startTime" 
          type="time" 
          value={event.startTime}
          onChange={e => onEventChange({...event, startTime: e.target.value})}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="endTime">Hora de Término</Label>
        <Input 
          id="endTime" 
          type="time" 
          value={event.endTime}
          onChange={e => onEventChange({...event, endTime: e.target.value})}
        />
      </div>
    </div>
  );
}
