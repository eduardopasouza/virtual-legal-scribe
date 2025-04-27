
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { UploadStatus } from '../document/UploadStatus';

interface UploadProgressProps {
  uploadStatus: 'idle' | 'success' | 'error' | 'loading' | 'processing';
  errorMessage: string | null;
  processingProgress: number;
}

export function UploadProgress({ 
  uploadStatus, 
  errorMessage,
  processingProgress 
}: UploadProgressProps) {
  if (uploadStatus === 'idle') return null;

  if (uploadStatus === 'success' || uploadStatus === 'error') {
    return (
      <UploadStatus 
        status={uploadStatus} 
        errorMessage={errorMessage}
      />
    );
  }

  if (uploadStatus === 'processing') {
    return (
      <div className="space-y-2 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-sm">Processando documento...</span>
          </div>
          <span className="text-sm font-medium">{processingProgress}%</span>
        </div>
        <Progress value={processingProgress} className="h-2" />
      </div>
    );
  }

  return null;
}
