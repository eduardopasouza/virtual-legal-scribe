
import React from 'react';
import { UploadContainer } from './upload/UploadContainer';

interface DocumentUploaderProps {
  caseId?: string;
  onSuccess?: (selectedFiles: File[], extractedContent?: string) => void;
  optional?: boolean;
  allowMultiple?: boolean;
}

export function DocumentUploader(props: DocumentUploaderProps) {
  return <UploadContainer {...props} />;
}
