
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormSection } from "./FormSection"
import type { Event } from '@/types/calendar'
import { useFormValidation } from '@/hooks/useFormValidation'

interface AdditionalDetailsProps {
  event: Omit<Event, 'id'>;
  onEventChange: (event: Omit<Event, 'id'>) => void;
}

export function AdditionalDetails({ event, onEventChange }: AdditionalDetailsProps) {
  const { validateField } = useFormValidation();
  
  const validateDescription = (value: string) => {
    const error = validateField('description', value, { required: true, minLength: 10 });
    if (error) {
      return error;
    }
    onEventChange({...event, description: value});
  };

  return (
    <FormSection>
      <div className="space-y-2">
        <Label htmlFor="relatedCase" className="font-medium">Processo Relacionado (opcional)</Label>
        <Input 
          id="relatedCase" 
          value={event.relatedCase || ''}
          onChange={e => onEventChange({...event, relatedCase: e.target.value})}
          placeholder="Número do processo ou nome do caso"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="font-medium">Descrição</Label>
        <Textarea 
          id="description" 
          value={event.description}
          onChange={e => validateDescription(e.target.value)}
          placeholder="Detalhes adicionais sobre o evento"
          rows={3}
          required
        />
      </div>
    </FormSection>
  );
}
