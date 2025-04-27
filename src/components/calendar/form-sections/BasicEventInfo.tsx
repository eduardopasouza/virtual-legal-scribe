
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormSection } from "./FormSection"
import type { Event } from '@/types/calendar'
import { useFormValidation } from '@/hooks/useFormValidation'

interface BasicEventInfoProps {
  event: Omit<Event, 'id'>;
  onEventChange: (event: Omit<Event, 'id'>) => void;
}

export function BasicEventInfo({ event, onEventChange }: BasicEventInfoProps) {
  const { validateField } = useFormValidation();
  
  const validateTitle = (value: string) => {
    const error = validateField('title', value, { required: true, minLength: 3 });
    if (error) {
      return error;
    }
    onEventChange({ ...event, title: value });
  };

  return (
    <FormSection>
      <div className="space-y-2">
        <Label htmlFor="title" className="font-medium">Título</Label>
        <Input 
          id="title" 
          value={event.title} 
          onChange={e => validateTitle(e.target.value)}
          placeholder="Título do evento"
          aria-required="true"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-medium">Data</Label>
          <div className="flex items-center h-10 rounded-md border border-input px-3 py-2">
            {event.date.toLocaleDateString()}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type" className="font-medium">Tipo</Label>
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
    </FormSection>
  );
}
