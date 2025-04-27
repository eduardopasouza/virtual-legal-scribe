
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
  Legend 
} from 'recharts';
import { WorkflowMetrics } from '@/types/statistics';

interface WorkflowAnalysisChartProps {
  data?: WorkflowMetrics[];
  isLoading?: boolean;
}

export const WorkflowAnalysisChart = ({ data, isLoading }: WorkflowAnalysisChartProps) => {
  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Análise de Fluxo de Trabalho</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <div className="text-muted-foreground">Carregando dados de fluxo de trabalho...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Análise de Fluxo de Trabalho</CardTitle>
        <CardDescription>
          Tempo médio gasto e frequência de gargalos por etapa
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stageName" />
            <YAxis yAxisId="left" orientation="left" stroke="#0f766e" />
            <YAxis yAxisId="right" orientation="right" stroke="#1a365d" tickFormatter={(value) => `${value}%`} />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'Tempo Médio') {
                  return [`${value} horas`, name];
                }
                return [`${value}%`, name];
              }}
            />
            <Legend />
            <Bar 
              yAxisId="left" 
              dataKey="averageTimeSpent" 
              name="Tempo Médio" 
              fill="#0f766e" 
            />
            <Bar 
              yAxisId="right" 
              dataKey="bottleneckFrequency" 
              name="Frequência de Gargalos" 
              fill="#1a365d" 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
