
import React, { useState } from 'react';
import { File, X, Eye, EyeOff, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { formatFileSize } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
  disabled?: boolean;
  extractedContent?: string | null;
}

export function FilePreview({ file, onRemove, disabled = false, extractedContent = null }: FilePreviewProps) {
  const [showContent, setShowContent] = useState(false);
  
  const getFileIcon = () => {
    if (file.name.endsWith('.pdf')) {
      return <FileText className="h-8 w-8 text-primary" />;
    } else if (file.name.endsWith('.docx')) {
      return <FileText className="h-8 w-8 text-blue-500" />;
    }
    return <File className="h-8 w-8 text-primary" />;
  };

  return (
    <div className="border rounded-md p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getFileIcon()}
          <div className="text-left">
            <p className="text-sm font-medium truncate max-w-[200px]">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
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
      
      {extractedContent && (
        <Collapsible className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Conteúdo extraído</p>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => setShowContent(!showContent)}>
                {showContent ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="ml-2 text-xs">
                  {showContent ? "Ocultar" : "Mostrar"}
                </span>
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="mt-2">
            <ScrollArea className="h-[150px] w-full rounded border p-2 bg-muted/30">
              <div className="text-xs text-muted-foreground whitespace-pre-wrap">
                {extractedContent.substring(0, 2000)}
                {extractedContent.length > 2000 && (
                  <span className="text-primary font-medium"> [...mais conteúdo]</span>
                )}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
