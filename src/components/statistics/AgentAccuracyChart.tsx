
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell
} from 'recharts';
import { AgentMetrics } from '@/types/statistics';

interface AgentAccuracyChartProps {
  data?: AgentMetrics[];
  isLoading?: boolean;
}

export const AgentAccuracyChart = ({ data, isLoading }: AgentAccuracyChartProps) => {
  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Precisão dos Agentes</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <div className="text-muted-foreground">Carregando dados de precisão...</div>
        </CardContent>
      </Card>
    );
  }

  // Sort data by accuracy rate
  const sortedData = [...data].sort((a, b) => b.accuracyRate - a.accuracyRate);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Precisão dos Agentes</CardTitle>
        <CardDescription>
          Taxa de precisão e utilização de cada agente do EVJI
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={sortedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis 
              type="number" 
              domain={[0, 100]} 
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              dataKey="agentName" 
              type="category" 
              width={100}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Precisão']}
            />
            <Legend />
            <Bar 
              dataKey="accuracyRate" 
              name="Taxa de Precisão" 
              fill="#1a365d" 
              radius={[0, 4, 4, 0]}
            >
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.accuracyRate >= 95 ? "#047857" : entry.accuracyRate >= 90 ? "#0d9488" : "#0891b2"} />
              ))}
            </Bar>
            <Bar 
              dataKey="utilizationRate" 
              name="Taxa de Utilização" 
              fill="#d4af37" 
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
