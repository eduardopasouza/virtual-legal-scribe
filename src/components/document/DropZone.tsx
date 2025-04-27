
import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function DropZone({ onFileSelect, disabled = false }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };
  
  const handleFileSelection = (file: File) => {
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      onFileSelect(file);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-md p-6 text-center mt-4 transition-all duration-200
        ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
        ${disabled ? 'opacity-50' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          <UploadCloud className="h-12 w-12 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">
            Arraste e solte seu PDF aqui, ou
          </p>
          <Label 
            htmlFor="file-upload" 
            className="relative cursor-pointer text-sm text-primary hover:text-primary/80"
          >
            <span>selecione um arquivo</span>
            <Input
              id="file-upload"
              type="file"
              accept=".pdf"
              className="sr-only"
              onChange={handleFileChange}
              disabled={disabled}
            />
          </Label>
        </div>
        <p className="text-xs text-muted-foreground">
          Apenas arquivos PDF são aceitos.
        </p>
      </div>
    </div>
  );
}
