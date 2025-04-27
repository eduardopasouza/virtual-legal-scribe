
import React, { useState } from 'react';
import { format, startOfToday, eachDayOfInterval, startOfMonth, endOfMonth, add } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Import Badge component
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, User2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'audiencia' | 'prazo' | 'reuniao' | 'outro';
  description: string;
  relatedCase?: string;
}

// Mock de eventos
const initialEvents: Event[] = [
  {
    id: '1',
    title: 'Audiência de Conciliação',
    date: new Date(2024, 3, 15), // 15 de Abril de 2024
    startTime: '14:00',
    endTime: '15:00',
    type: 'audiencia',
    description: 'Audiência de conciliação no processo de Indenização',
    relatedCase: 'Processo nº 0123456-78.2024.8.26.0100'
  },
  {
    id: '2',
    title: 'Prazo para Contestação',
    date: new Date(2024, 3, 20), // 20 de Abril de 2024
    startTime: '23:59',
    endTime: '23:59',
    type: 'prazo',
    description: 'Prazo final para apresentação da contestação',
    relatedCase: 'Processo nº 0987654-32.2024.8.26.0100'
  },
  {
    id: '3',
    title: 'Reunião com Cliente',
    date: new Date(2024, 3, 25), // 25 de Abril de 2024
    startTime: '10:00',
    endTime: '11:30',
    type: 'reuniao',
    description: 'Reunião para discutir estratégia do caso',
    relatedCase: 'Processo nº 0123456-78.2024.8.26.0100'
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'audiencia':
      return 'bg-blue-500';
    case 'prazo':
      return 'bg-red-500';
    case 'reuniao':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'audiencia':
      return 'Audiência';
    case 'prazo':
      return 'Prazo';
    case 'reuniao':
      return 'Reunião';
    default:
      return 'Outro';
  }
};

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    date: new Date(),
    startTime: '09:00',
    endTime: '10:00',
    type: 'reuniao',
    description: ''
  });
  
  const { toast } = useToast();
  
  const today = startOfToday();
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  const previousMonth = () => {
    setCurrentMonth(add(currentMonth, { months: -1 }));
  };
  
  const nextMonth = () => {
    setCurrentMonth(add(currentMonth, { months: 1 }));
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setNewEvent(prev => ({
      ...prev,
      date
    }));
    setIsDialogOpen(true);
  };
  
  const handleCreateEvent = () => {
    const generatedId = Date.now().toString();
    const newEventWithId = { ...newEvent, id: generatedId };
    
    setEvents([...events, newEventWithId]);
    setIsDialogOpen(false);
    
    toast({
      title: "Evento criado",
      description: `"${newEvent.title}" foi adicionado ao calendário.`
    });
    
    // Reset form
    setNewEvent({
      title: '',
      date: new Date(),
      startTime: '09:00',
      endTime: '10:00',
      type: 'reuniao',
      description: ''
    });
  };
  
  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() && 
      event.date.getMonth() === date.getMonth() && 
      event.date.getFullYear() === date.getFullYear()
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h1 className="text-2xl font-bold text-evji-primary">Calendário</h1>
              <Button onClick={() => {
                setSelectedDate(new Date());
                setIsDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Evento
              </Button>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-muted-foreground" />
                    {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={previousMonth}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentMonth(startOfMonth(new Date()))}>
                      Hoje
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextMonth}>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium p-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: days[0].getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square p-1" />
                  ))}
                  
                  {days.map((day) => {
                    const eventsForDay = getEventsForDay(day);
                    const isToday = day.getDate() === today.getDate() && 
                                  day.getMonth() === today.getMonth() && 
                                  day.getFullYear() === today.getFullYear();
                    
                    return (
                      <div 
                        key={day.toString()} 
                        className={cn(
                          "aspect-square p-1",
                          isToday ? "bg-muted/50 rounded-md" : ""
                        )}
                        onClick={() => handleDateClick(day)}
                      >
                        <div className={cn(
                          "h-full rounded-md p-1 cursor-pointer hover:bg-muted transition-colors",
                          isToday ? "font-bold" : ""
                        )}>
                          <div className="text-right text-sm p-1">
                            {format(day, 'd')}
                          </div>
                          
                          <div className="space-y-1 mt-1">
                            {eventsForDay.slice(0, 2).map(event => (
                              <div 
                                key={event.id}
                                className="flex items-center space-x-1"
                              >
                                <div className={`w-2 h-2 rounded-full ${getTypeColor(event.type)}`} />
                                <span className="text-xs truncate">{event.title}</span>
                              </div>
                            ))}
                            {eventsForDay.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{eventsForDay.length - 2} mais
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events
                    .filter(event => new Date(event.date) >= new Date())
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .slice(0, 5)
                    .map(event => (
                      <div key={event.id} className="flex items-start gap-4 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                        <div className={`w-1 self-stretch rounded-full ${getTypeColor(event.type)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{event.title}</div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              {format(event.date, 'dd/MM/yyyy', { locale: ptBR })}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {event.startTime} - {event.endTime}
                            </div>
                          </div>
                          {event.relatedCase && (
                            <div className="flex items-center gap-1 mt-1 text-xs">
                              <FileText className="h-3 w-3" />
                              {event.relatedCase}
                            </div>
                          )}
                        </div>
                        <Badge className={cn(
                          'text-xs',
                          getTypeColor(event.type).replace('bg-', 'bg-opacity-20 text-').replace('-500', '-700')
                        )}>
                          {getTypeLabel(event.type)}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                  <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione uma data'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select 
                  value={newEvent.type}
                  onValueChange={value => setNewEvent({...newEvent, type: value as any})}
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
            <Button onClick={handleCreateEvent} disabled={!newEvent.title}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
