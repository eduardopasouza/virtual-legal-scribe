
import React from 'react';

interface SearchContainerProps {
  children: React.ReactNode;
}

export function SearchContainer({ children }: SearchContainerProps) {
  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="space-y-6">
        {children}
      </div>
    </main>
  );
}
