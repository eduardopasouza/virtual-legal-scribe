
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function CasePeople() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pessoas Vinculadas</CardTitle>
        <CardDescription>
          Pessoas envolvidas neste caso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-1">Cliente</h3>
            <p>Maria Silva</p>
            <p className="text-sm text-muted-foreground">cliente@email.com</p>
            <p className="text-sm text-muted-foreground">(11) 98765-4321</p>
          </div>
          <div className="p-4 border rounded-md">
            <h3 className="font-medium mb-1">Advogado Responsável</h3>
            <p>Dr. Paulo Oliveira</p>
            <p className="text-sm text-muted-foreground">advogado@escritorio.com</p>
            <p className="text-sm text-muted-foreground">(11) 91234-5678</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
