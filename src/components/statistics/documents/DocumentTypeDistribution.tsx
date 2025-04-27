
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface DocumentType {
  type: string;
  count: number;
}

interface DocumentTypeDistributionProps {
  documentTypes: DocumentType[];
}

export const DocumentTypeDistribution = ({ documentTypes }: DocumentTypeDistributionProps) => {
  const totalDocs = documentTypes.reduce((sum, type) => sum + type.count, 0);

  return (
    <div>
      <h4 className="text-sm font-medium mb-3">Distribuição por Tipo</h4>
      <div className="space-y-3">
        {documentTypes.map((type, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{type.type}</span>
              <span className="text-muted-foreground">
                {type.count} ({Math.round((type.count / totalDocs) * 100)}%)
              </span>
            </div>
            <Progress value={(type.count / totalDocs) * 100} />
          </div>
        ))}
      </div>
    </div>
  );
};
