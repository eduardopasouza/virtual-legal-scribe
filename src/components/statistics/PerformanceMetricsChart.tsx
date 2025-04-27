
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

interface PerformanceMetricsChartProps {
  completionTimeData?: TimeSeriesData[];
  successRateData?: TimeSeriesData[];
  isLoading?: boolean;
}

export const PerformanceMetricsChart = ({ 
  completionTimeData, 
  successRateData, 
  isLoading 
}: PerformanceMetricsChartProps) => {
  if (isLoading || !completionTimeData || !successRateData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Métricas de Desempenho</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <div className="text-muted-foreground">Carregando dados de desempenho...</div>
        </CardContent>
      </Card>
    );
  }

  // Combine data for the dual axis chart
  const combinedData = completionTimeData.map((item, index) => ({
    date: item.date,
    completionTime: item.value,
    successRate: successRateData[index]?.value || 0
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Métricas de Desempenho</CardTitle>
        <CardDescription>
          Tempo médio de conclusão e taxa de sucesso ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={combinedData}
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
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              stroke="#0f766e"
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#1a365d"
              domain={[60, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'Tempo de Conclusão') {
                  return [`${value} dias`, name];
                }
                return [`${value}%`, name];
              }}
              labelFormatter={(label) => {
                const date = new Date(label);
                return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
              }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="completionTime" 
              name="Tempo de Conclusão" 
              stroke="#0f766e" 
              strokeWidth={2}
              dot={{ r: 3 }} 
              activeDot={{ r: 5 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="successRate" 
              name="Taxa de Sucesso" 
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
