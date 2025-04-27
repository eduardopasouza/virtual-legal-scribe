
import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UploadStatusProps {
  status: 'success' | 'error';
  errorMessage?: string | null;
}

export function UploadStatus({ status, errorMessage }: UploadStatusProps) {
  if (status === 'success') {
    return (
      <Alert className="bg-green-50 border-green-200 text-green-800">
        <Check className="h-4 w-4 text-green-600" />
        <AlertTitle>Sucesso!</AlertTitle>
        <AlertDescription>
          O documento foi enviado com sucesso.
        </AlertDescription>
      </Alert>
    );
  }

  if (status === 'error') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro no Upload</AlertTitle>
        <AlertDescription>
          {errorMessage || "Ocorreu um erro ao enviar o documento."}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
