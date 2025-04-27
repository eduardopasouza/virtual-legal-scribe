
import React from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UploadStatusProps {
  status: 'success' | 'error' | 'loading' | 'processing';
  errorMessage?: string | null;
}

export function UploadStatus({ status, errorMessage }: UploadStatusProps) {
  if (status === 'success') {
    return (
      <Alert className="bg-green-50 border-green-200 text-green-800">
        <Check className="h-4 w-4 text-green-600" />
        <AlertTitle>Sucesso!</AlertTitle>
        <AlertDescription>
          O documento foi enviado com sucesso e está pronto para análise.
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

  if (status === 'loading' || status === 'processing') {
    return (
      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
        <AlertTitle>
          {status === 'loading' ? 'Enviando...' : 'Processando...'}
        </AlertTitle>
        <AlertDescription>
          {status === 'loading' 
            ? "Enviando documento para o servidor." 
            : "Extraindo conteúdo do documento para análise."
          }
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
