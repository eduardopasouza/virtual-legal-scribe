
import { Card } from "@/components/ui/card";
import { UploadHeader } from './UploadHeader';
import { UploadContent } from './UploadContent';
import { useUploadState } from '@/hooks/useUploadState';

interface UploadContainerProps {
  caseId?: string;
  onSuccess?: (selectedFiles: File[], extractedContent?: string) => void;
  optional?: boolean;
  allowMultiple?: boolean;
}

export function UploadContainer({ 
  caseId, 
  onSuccess, 
  optional = false, 
  allowMultiple = false 
}: UploadContainerProps) {
  const {
    selectedFile,
    documentType,
    uploadStatus,
    errorMessage,
    processingProgress,
    extractedText,
    setDocumentType,
    handleFileSelection,
    handleSubmit,
    clearSelectedFile
  } = useUploadState({ onSuccess, caseId });

  return (
    <Card>
      <UploadHeader optional={optional} />
      <UploadContent
        uploadStatus={uploadStatus}
        errorMessage={errorMessage}
        processingProgress={processingProgress}
        selectedFile={selectedFile}
        documentType={documentType}
        extractedText={extractedText}
        onFileSelect={handleFileSelection}
        onTypeChange={setDocumentType}
        onRemoveFile={clearSelectedFile}
        onSubmit={handleSubmit}
      />
    </Card>
  );
}
