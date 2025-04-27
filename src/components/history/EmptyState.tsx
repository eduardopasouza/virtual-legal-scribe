
import React from 'react';
import { Clock, FileText } from 'lucide-react';

interface EmptyStateProps {
  type: 'timeline' | 'list';
}

export function EmptyState({ type }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {type === 'timeline' ? (
        <Clock className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
      ) : (
        <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
      )}
      <h3 className="mt-4 text-lg font-medium">Nenhuma atividade encontrada</h3>
      <p className="mt-2 text-muted-foreground">
        Nenhuma atividade corresponde aos filtros selecionados.
      </p>
    </div>
  );
}
