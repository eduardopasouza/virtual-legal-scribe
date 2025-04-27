
import React from 'react';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ 
  children,
  className
}: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  );
}
