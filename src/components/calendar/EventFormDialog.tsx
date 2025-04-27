
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Event } from '@/types/calendar';
import { BasicEventInfo } from './form-sections/BasicEventInfo';
import { TimeSelection } from './form-sections/TimeSelection';
import { AdditionalDetails } from './form-sections/AdditionalDetails';
import { FormSection } from './form-sections/FormSection';

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Omit<Event, 'id'>;
  onEventChange: React.Dispatch<React.SetStateAction<Omit<Event, 'id'>>>;
  onSubmit: () => void;
}

export function EventFormDialog({ 
  open, 
  onOpenChange, 
  event, 
  onEventChange, 
  onSubmit 
}: EventFormDialogProps) {
  const isFormValid = event.title && event.description && event.startTime && event.endTime;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Evento</DialogTitle>
          <DialogDescription>
            Adicione um novo evento ao calendário
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          if (isFormValid) {
            onSubmit();
          }
        }}>
          <FormSection className="space-y-6">
            <BasicEventInfo event={event} onEventChange={onEventChange} />
            <TimeSelection event={event} onEventChange={onEventChange} />
            <AdditionalDetails event={event} onEventChange={onEventChange} />
          </FormSection>
          
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancelar</Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={!isFormValid}
            >
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
