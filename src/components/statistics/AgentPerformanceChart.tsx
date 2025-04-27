
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AgentMetrics } from '@/types/statistics';

interface AgentPerformanceChartProps {
  data?: AgentMetrics[];
  isLoading?: boolean;
}

export const AgentPerformanceChart = ({ data, isLoading }: AgentPerformanceChartProps) => {
  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Desempenho dos Agentes</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="text-muted-foreground">Carregando dados de desempenho...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Desempenho dos Agentes</CardTitle>
        <CardDescription>
          Comparativo de casos processados e métricas de desempenho por agente
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="agentName" />
            <YAxis yAxisId="left" orientation="left" stroke="#1a365d" />
            <YAxis yAxisId="right" orientation="right" stroke="#d4af37" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="casesProcessed" name="Casos Processados" fill="#1a365d" />
            <Bar yAxisId="right" dataKey="averageProcessingTime" name="Tempo Médio (horas)" fill="#d4af37" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
