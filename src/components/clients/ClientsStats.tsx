
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, UserMinus, Clock, FileText, DollarSign } from 'lucide-react';
import { ClientStats } from '@/types/client';

interface ClientsStatsProps {
  stats?: ClientStats;
  isLoading: boolean;
}

export const ClientsStats = ({ stats, isLoading }: ClientsStatsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array(5).fill(0).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  const defaultStats: ClientStats = stats || {
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
    pendingClients: 0,
    totalCases: 0,
    totalActiveCases: 0,
    totalValue: 0
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total de Clientes</p>
              <h3 className="text-2xl font-bold">{defaultStats.totalClients}</h3>
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Clientes Ativos</p>
              <h3 className="text-2xl font-bold">
                {defaultStats.activeClients}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  {defaultStats.totalClients > 0 ? 
                    `(${Math.round((defaultStats.activeClients / defaultStats.totalClients) * 100)}%)` : 
                    '(0%)'}
                </span>
              </h3>
            </div>
            <div className="bg-green-500/10 p-2 rounded-full">
              <User className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Clientes Inativos</p>
              <h3 className="text-2xl font-bold">
                {defaultStats.inactiveClients}
              </h3>
            </div>
            <div className="bg-gray-400/10 p-2 rounded-full">
              <UserMinus className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Casos Ativos</p>
              <h3 className="text-2xl font-bold">{defaultStats.totalActiveCases}</h3>
            </div>
            <div className="bg-blue-500/10 p-2 rounded-full">
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Valor Total</p>
              <h3 className="text-2xl font-bold">{formatCurrency(defaultStats.totalValue)}</h3>
            </div>
            <div className="bg-amber-500/10 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-amber-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
