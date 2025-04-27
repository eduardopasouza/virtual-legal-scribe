
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/types/case";
import { AlertTriangle, Bell, Calendar, Info } from "lucide-react";

interface CaseAlertsProps {
  alerts: Alert[];
}

export function CaseAlerts({ alerts }: CaseAlertsProps) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 text-muted-foreground">
            <div className="flex justify-center mb-4">
              <Bell className="h-12 w-12 text-muted-foreground/50" />
            </div>
            <p>Nenhum alerta pendente para este caso.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'medium':
        return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'low':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <Calendar className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Alertas ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-md p-4 ${getPriorityColor(alert.priority)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div>
                  <h4 className="font-medium text-sm">{alert.title}</h4>
                  {alert.description && (
                    <p className="text-sm mt-1">{alert.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
