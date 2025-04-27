
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Event } from '@/types/calendar';

interface EventFormDialogProps {
  showEventForm: boolean;
  setShowEventForm: (show: boolean) => void;
  newEvent: Omit<Event, 'id'>;
  setNewEvent: React.Dispatch<React.SetStateAction<Omit<Event, 'id'>>>;
  onSubmit: () => void;
}

export function EventFormDialog({ 
  showEventForm, 
  setShowEventForm, 
  newEvent, 
  setNewEvent, 
  onSubmit 
}: EventFormDialogProps) {
  return (
    <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Evento</DialogTitle>
          <DialogDescription>
            Adicione um novo evento ao calendário
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input 
              id="title" 
              value={newEvent.title} 
              onChange={e => setNewEvent({...newEvent, title: e.target.value})}
              placeholder="Título do evento"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data</Label>
              <div className="flex items-center h-10 rounded-md border border-input px-3 py-2">
                {newEvent.date.toLocaleDateString()}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select 
                value={newEvent.type}
                onValueChange={value => setNewEvent({...newEvent, type: value as Event['type']})}
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Hora de Início</Label>
              <Input 
                id="startTime" 
                type="time" 
                value={newEvent.startTime}
                onChange={e => setNewEvent({...newEvent, startTime: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">Hora de Término</Label>
              <Input 
                id="endTime" 
                type="time" 
                value={newEvent.endTime}
                onChange={e => setNewEvent({...newEvent, endTime: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="relatedCase">Processo Relacionado (opcional)</Label>
            <Input 
              id="relatedCase" 
              value={newEvent.relatedCase || ''}
              onChange={e => setNewEvent({...newEvent, relatedCase: e.target.value})}
              placeholder="Número do processo ou nome do caso"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea 
              id="description" 
              value={newEvent.description}
              onChange={e => setNewEvent({...newEvent, description: e.target.value})}
              placeholder="Detalhes adicionais sobre o evento"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={onSubmit} disabled={!newEvent.title}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
