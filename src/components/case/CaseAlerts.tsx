import { AlertCircle } from "lucide-react";
import { Alert } from "@/types/case";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CaseAlertsProps {
  alerts: Alert[];
  isLoading?: boolean;
}

export function CaseAlerts({ alerts, isLoading = false }: CaseAlertsProps) {
  if (isLoading) {
    return (
      <Card className="border-l-4 border-l-gray-300 animate-pulse">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-gray-400" />
            Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded-lg" />
            <div className="h-16 bg-gray-200 rounded-lg" />
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
            <AlertCircle className="h-5 w-5 text-green-500" />
            Alertas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm">Nenhum alerta pendente no momento.</p>
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
            <div key={alert.id} className={`p-4 rounded-md border shadow-sm ${alert.priority === 'high' ? 'border-red-400' : 'border-amber-400'}`}>
              <h4 className="text-sm font-semibold">{alert.title}</h4>
              {alert.description && <p className="text-xs text-muted-foreground">{alert.description}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
