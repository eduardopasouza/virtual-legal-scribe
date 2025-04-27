
import { Button } from "@/components/ui/button";
import { DropZone } from "@/components/document/DropZone";
import { FilePreview } from "@/components/document/FilePreview";
import { X } from "lucide-react";

interface ChatUploaderProps {
  selectedFile: File | null;
  isUploading: boolean;
  onFileSelect: (file: File) => void;
  onUpload: () => Promise<void>;
  onClose: () => void;
  onRemoveFile: () => void;
}

export function ChatUploader({
  selectedFile,
  isUploading,
  onFileSelect,
  onUpload,
  onClose,
  onRemoveFile
}: ChatUploaderProps) {
  return (
    <div className="bg-muted/20 border-t p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Upload de documento jurídico</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      {selectedFile ? (
        <div className="space-y-3">
          <FilePreview 
            file={selectedFile}
            onRemove={onRemoveFile}
            disabled={isUploading}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm" 
              onClick={onRemoveFile}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={onUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Enviando...' : 'Enviar para análise'}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-3">
            Envie documentos jurídicos como contratos, petições ou documentos processuais para análise automatizada.
          </p>
          <DropZone onFileSelect={onFileSelect} disabled={isUploading} />
        </>
      )}
    </div>
  );
}
