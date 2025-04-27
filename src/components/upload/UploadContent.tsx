
import { CardContent } from "@/components/ui/card";
import { UploadProgress } from './UploadProgress';
import { UploadForm } from './UploadForm';

interface UploadContentProps {
  uploadStatus: 'idle' | 'success' | 'error' | 'loading' | 'processing';
  errorMessage: string | null;
  processingProgress: number;
  selectedFile: File | null;
  documentType: string;
  extractedText: string | null;
  onFileSelect: (file: File) => void;
  onTypeChange: (value: string) => void;
  onRemoveFile: () => void;
  onSubmit: () => void;
}

export function UploadContent({
  uploadStatus,
  errorMessage,
  processingProgress,
  selectedFile,
  documentType,
  extractedText,
  onFileSelect,
  onTypeChange,
  onRemoveFile,
  onSubmit
}: UploadContentProps) {
  return (
    <CardContent>
      <div className="space-y-4">
        <UploadProgress 
          uploadStatus={uploadStatus}
          errorMessage={errorMessage}
          processingProgress={processingProgress}
        />
        <UploadForm
          selectedFile={selectedFile}
          documentType={documentType}
          uploadStatus={uploadStatus}
          extractedText={extractedText}
          onFileSelect={onFileSelect}
          onTypeChange={onTypeChange}
          onRemoveFile={onRemoveFile}
          onSubmit={onSubmit}
        />
      </div>
    </CardContent>
  );
}
