
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Client } from '@/types/client';

interface ClientsMapProps {
  clients: Client[];
  isLoading: boolean;
}

export const ClientsMap = ({ clients, isLoading }: ClientsMapProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Distribuição Geográfica</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Distribuição Geográfica</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full bg-gray-100 rounded-md flex items-center justify-center text-muted-foreground">
          {/* Em uma implementação real, aqui entraria um componente de mapa */}
          <p className="text-center">
            Mapa de distribuição dos clientes<br />
            <span className="text-sm">(Integrável com serviços como Google Maps ou Mapbox)</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
