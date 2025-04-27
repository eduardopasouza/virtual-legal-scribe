
import React from 'react';

interface EmptySearchStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function EmptySearchState({ icon, title, description }: EmptySearchStateProps) {
  return (
    <div className="text-center py-12">
      {icon}
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
