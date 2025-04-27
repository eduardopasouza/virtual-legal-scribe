
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: LucideIcon;
  iconColor?: string;
  description?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  iconColor = "text-primary",
  description
}: MetricCardProps) => {
  const showChange = change !== undefined;
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {Icon && (
            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center bg-opacity-20", 
              iconColor.replace('text-', 'bg-'))}>
              <Icon className={cn("h-4 w-4", iconColor)} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {showChange && (
          <p className="text-xs text-muted-foreground">
            <span className={cn({
              "text-green-500": isPositive,
              "text-red-500": isNegative,
              "text-gray-500": change === 0
            })}>
              {change > 0 ? "+" : ""}{change}%
            </span>
            {description && ` ${description}`}
          </p>
        )}
        {!showChange && description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
