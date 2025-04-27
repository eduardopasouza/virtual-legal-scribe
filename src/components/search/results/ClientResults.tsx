
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar } from 'lucide-react';

interface ClientResultsProps {
  clients: any[];
  showCompact: boolean;
}

export function ClientResults({ clients, showCompact }: ClientResultsProps) {
  return (
    <>
      <CardHeader className={showCompact ? "pb-2" : ""}>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" />
          Clientes {!showCompact && `(${clients.length})`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clients.map(client => (
            <div key={client.id} className="p-4 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{client.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>{client.email}</span>
                    <span>•</span>
                    <span>{client.phone}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {client.cases} caso{client.cases !== 1 ? 's' : ''}
                </Badge>
              </div>

              {!showCompact && (
                <div className="text-sm text-muted-foreground mt-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Última atividade: {format(client.lastActivity, 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
}
