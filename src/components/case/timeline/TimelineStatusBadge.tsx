
import { Badge } from "@/components/ui/badge";
import { TimelineEvent } from "@/hooks/useTimelineEvents";

export function TimelineStatusBadge({ event }: { event: TimelineEvent }) {
  if (!event.status) return null;
  
  let color = "";
  let text = event.status;
  
  switch (event.type) {
    case 'activity':
      color = event.status === 'concluido' ? 'bg-green-500' : 
              event.status === 'erro' ? 'bg-red-500' : 
              event.status === 'em_processamento' ? 'bg-blue-500' : 'bg-amber-500';
      break;
    case 'document':
      color = event.status === 'processed' ? 'bg-green-500' : 
              event.status === 'pending' ? 'bg-amber-500' : 'bg-red-500';
      text = event.status === 'processed' ? 'Processado' : 
             event.status === 'pending' ? 'Pendente' : 'Erro';
      break;
    case 'deadline':
      color = event.status === 'concluido' ? 'bg-green-500' : 
              event.status === 'atrasado' ? 'bg-red-500' : 'bg-amber-500';
      text = event.status === 'concluido' ? 'Concluído' : 
             event.status === 'atrasado' ? 'Atrasado' : 'Pendente';
      break;
    case 'alert':
      color = event.status === 'resolved' ? 'bg-green-500' : 'bg-red-500';
      text = event.status === 'resolved' ? 'Resolvido' : 'Pendente';
      break;
  }
  
  return <Badge className={color}>{text}</Badge>;
}
