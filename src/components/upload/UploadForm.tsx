
import React from 'react';
import { DropZone } from '../document/DropZone';
import { FilePreview } from '../document/FilePreview';
import { DocumentTypeSelect } from '../document/DocumentTypeSelect';
import { DocumentActions } from '../document/DocumentActions';

interface UploadFormProps {
  selectedFile: File | null;
  documentType: string;
  uploadStatus: 'idle' | 'success' | 'error' | 'loading' | 'processing';
  extractedText: string | null;
  onFileSelect: (file: File) => void;
  onTypeChange: (type: string) => void;
  onRemoveFile: () => void;
  onSubmit: () => void;
}

export function UploadForm({
  selectedFile,
  documentType,
  uploadStatus,
  extractedText,
  onFileSelect,
  onTypeChange,
  onRemoveFile,
  onSubmit
}: UploadFormProps) {
  const isLoading = uploadStatus === 'loading' || uploadStatus === 'processing';

  return selectedFile ? (
    <div className="space-y-4">
      <FilePreview
        file={selectedFile}
        onRemove={onRemoveFile}
        disabled={isLoading}
        extractedContent={extractedText}
      />
      
      <DocumentTypeSelect 
        value={documentType}
        onChange={onTypeChange}
        disabled={isLoading}
      />
      
      <DocumentActions 
        onCancel={onRemoveFile}
        onSubmit={onSubmit}
        isSubmitting={isLoading}
        disabled={isLoading}
        uploadStatus={uploadStatus}
      />
    </div>
  ) : (
    <DropZone
      onFileSelect={onFileSelect}
      disabled={isLoading}
    />
  );
}
