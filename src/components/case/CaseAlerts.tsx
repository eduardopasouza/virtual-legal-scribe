
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from '@/types/case';

interface CaseAlertsProps {
  alerts: Alert[];
}

export const CaseAlerts = React.memo(({ alerts }: CaseAlertsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Alertas</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts && alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 border rounded-md ${
                  alert.priority === 'high' 
                    ? 'border-red-400 bg-red-50 dark:bg-red-900/10' 
                    : alert.priority === 'medium'
                    ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/10'
                    : 'border-blue-400 bg-blue-50 dark:bg-blue-900/10'
                }`}
              >
                <p className="font-medium">{alert.title}</p>
                {alert.description && (
                  <p className="text-sm mt-1">{alert.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-6">
            Nenhum alerta pendente.
          </p>
        )}
      </CardContent>
    </Card>
  );
});

CaseAlerts.displayName = 'CaseAlerts';
