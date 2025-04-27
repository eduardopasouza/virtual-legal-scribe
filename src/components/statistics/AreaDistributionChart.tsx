
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { AreaMetrics } from '@/types/statistics';

interface AreaDistributionChartProps {
  data?: AreaMetrics[];
  isLoading?: boolean;
}

const COLORS = ['#1a365d', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

export const AreaDistributionChart = ({ data, isLoading }: AreaDistributionChartProps) => {
  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribuição por Área</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <div className="text-muted-foreground">Carregando dados de distribuição...</div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map(item => ({
    name: item.area,
    value: item.caseCount
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Distribuição por Área</CardTitle>
        <CardDescription>
          Casos por área do direito
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={130}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
