
import React from 'react';
import { File, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  disabled?: boolean;
}

export function FilePreview({ file, onRemove, disabled = false }: FilePreviewProps) {
  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex items-center gap-3">
        <File className="h-8 w-8 text-primary" />
        <div className="text-left">
          <p className="text-sm font-medium truncate max-w-[200px]">
            {file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onRemove}
        disabled={disabled}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
