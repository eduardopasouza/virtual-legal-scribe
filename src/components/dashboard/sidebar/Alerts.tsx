
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert as AlertType } from "@/types/case";
import { useNotifications } from "../../../components/notification/NotificationSystem";

export function Alerts() {
  const { addNotification } = useNotifications();
  
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ["dashboard-alerts"],
    queryFn: async () => {
      // Get 3 most recent high-priority alerts
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('status', 'pending')
        .eq('priority', 'high')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data as AlertType[];
    },
  });

  useEffect(() => {
    // Notify user about high-priority alerts
    alerts.forEach(alert => {
      addNotification(
        'alert',
        alert.title,
        alert.description || 'Alerta de alta prioridade identificado.',
        'case'
      );
    });
  }, [alerts.length]); // Only run when number of alerts changes

  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-gray-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-gray-500" />
            Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm">Carregando alertas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-green-500" />
            Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm">Sem alertas pendentes no momento.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-l-4 border-l-red-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          Alertas ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Alert key={alert.id} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{alert.title}</AlertTitle>
              {alert.description && (
                <AlertDescription>
                  {alert.description}
                </AlertDescription>
              )}
            </Alert>
          ))}
          
          {alerts.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => {
                // Navigate to all alerts
                window.location.href = '/alerts';
              }}
            >
              Ver todos os alertas
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
