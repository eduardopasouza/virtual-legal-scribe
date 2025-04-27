
import React from 'react';
import { MetricCard } from './MetricCard';
import { CaseMetrics, ClientMetrics } from '@/types/statistics';
import { FileText, Users, Clock, Award, Inbox, FileCheck } from 'lucide-react';

interface MetricsGridProps {
  caseMetrics?: CaseMetrics;
  clientMetrics?: ClientMetrics;
  isLoading?: boolean;
}

export const MetricsGrid = ({ caseMetrics, clientMetrics, isLoading }: MetricsGridProps) => {
  if (isLoading || !caseMetrics || !clientMetrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array(8).fill(0).map((_, index) => (
          <MetricCard 
            key={index} 
            title="Carregando..." 
            value="--" 
            description="Aguarde, carregando dados..."
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard 
        title="Total de Casos" 
        value={caseMetrics.totalCases}
        change={12}
        description="em relação ao período anterior"
        icon={FileText}
        iconColor="text-blue-600"
      />
      
      <MetricCard 
        title="Casos Ativos" 
        value={caseMetrics.activeCases}
        change={5}
        description="em relação ao período anterior"
        icon={Inbox}
        iconColor="text-amber-600"
      />
      
      <MetricCard 
        title="Taxa de Sucesso" 
        value={`${caseMetrics.successRate}%`}
        change={4}
        description="em relação ao período anterior"
        icon={Award}
        iconColor="text-green-600"
      />
      
      <MetricCard 
        title="Tempo Médio" 
        value={`${caseMetrics.averageResolutionTime} dias`}
        change={-15}
        description="em relação ao período anterior"
        icon={Clock}
        iconColor="text-purple-600"
      />
      
      <MetricCard 
        title="Total de Clientes" 
        value={clientMetrics.totalClients}
        change={8}
        description="em relação ao período anterior"
        icon={Users}
        iconColor="text-indigo-600"
      />
      
      <MetricCard 
        title="Clientes Ativos" 
        value={clientMetrics.activeClients}
        change={6}
        description="em relação ao período anterior"
        icon={Users}
        iconColor="text-cyan-600"
      />
      
      <MetricCard 
        title="Novos Clientes" 
        value={clientMetrics.newClientsThisMonth}
        description="neste mês"
        icon={Users}
        iconColor="text-teal-600"
      />
      
      <MetricCard 
        title="Retenção de Clientes" 
        value={`${clientMetrics.clientRetentionRate}%`}
        change={2}
        description="em relação ao período anterior"
        icon={FileCheck}
        iconColor="text-emerald-600"
      />
    </div>
  );
};
