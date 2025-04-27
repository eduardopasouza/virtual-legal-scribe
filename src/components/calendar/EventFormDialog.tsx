
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Event } from '@/types/calendar';
import { BasicEventInfo } from './form-sections/BasicEventInfo';
import { TimeSelection } from './form-sections/TimeSelection';
import { AdditionalDetails } from './form-sections/AdditionalDetails';

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Evento</DialogTitle>
          <DialogDescription>
            Adicione um novo evento ao calendário
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <BasicEventInfo event={event} onEventChange={onEventChange} />
          <TimeSelection event={event} onEventChange={onEventChange} />
          <AdditionalDetails event={event} onEventChange={onEventChange} />
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={!event.title}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
