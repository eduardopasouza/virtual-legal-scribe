
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CardFooter } from "@/components/ui/card";

interface DocumentActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  disabled: boolean;
  uploadStatus: 'idle' | 'success' | 'error' | 'loading' | 'processing';
}

export function DocumentActions({ 
  onCancel, 
  onSubmit, 
  isSubmitting, 
  disabled,
  uploadStatus 
}: DocumentActionsProps) {
  return (
    <CardFooter className="justify-between">
      <Button 
        variant="outline" 
        onClick={onCancel} 
        disabled={disabled}
      >
        Cancelar
      </Button>
      <Button 
        onClick={onSubmit} 
        disabled={disabled}
      >
        {uploadStatus === 'loading' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : uploadStatus === 'processing' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>Enviar para Análise</>
        )}
      </Button>
    </CardFooter>
  );
}
