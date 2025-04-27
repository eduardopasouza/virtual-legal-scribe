
import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  allowedFileTypes?: string[];
}

export function DropZone({ 
  onFileSelect, 
  disabled = false,
  allowedFileTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
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
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    // Check if file type is allowed
    const isPdf = fileType === 'application/pdf' || fileName.endsWith('.pdf');
    const isDocx = fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx');
    
    if (isPdf || isDocx) {
      onFileSelect(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  // Generate accepted file types for the input
  const acceptedTypes = allowedFileTypes.join(',');
  
  // Create a readable list of allowed file types
  const allowedExtensions = ['.pdf', '.docx'];

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
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Arraste e solte seu documento aqui
          </p>
          <Button 
            onClick={handleButtonClick}
            variant="outline"
            disabled={disabled}
            className="mx-auto"
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            Selecionar arquivo
          </Button>
          <Input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            accept={acceptedTypes}
            className="sr-only"
            onChange={handleFileChange}
            disabled={disabled}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Formatos aceitos: {allowedExtensions.join(', ')}
        </p>
      </div>
    </div>
  );
}
