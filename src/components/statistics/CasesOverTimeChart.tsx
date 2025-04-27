
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { TimeSeriesData } from '@/types/statistics';

interface CasesOverTimeChartProps {
  data?: TimeSeriesData[];
  isLoading?: boolean;
}

export const CasesOverTimeChart = ({ data, isLoading }: CasesOverTimeChartProps) => {
  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Casos ao Longo do Tempo</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <div className="text-muted-foreground">Carregando dados de tendência...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Casos ao Longo do Tempo</CardTitle>
        <CardDescription>
          Evolução da quantidade de novos casos
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`${value} casos`, 'Quantidade']}
              labelFormatter={(label) => {
                const date = new Date(label);
                return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              name="Novos Casos" 
              stroke="#1a365d" 
              strokeWidth={2} 
              dot={{ r: 3 }} 
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
