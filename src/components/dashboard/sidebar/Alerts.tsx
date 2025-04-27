
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function Alerts() {
  return (
    <Card className="border-l-4 border-l-red-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
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
