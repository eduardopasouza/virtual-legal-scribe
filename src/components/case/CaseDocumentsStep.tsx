
import React from 'react';
import { Button } from "@/components/ui/button";
import { DocumentUploader } from "@/components/DocumentUploader";

interface CaseDocumentsStepProps {
  onBack: () => void;
  onFinish: () => void;
  onFileSelect: (files: File[]) => void;
  isSubmitting: boolean;
}

export function CaseDocumentsStep({ 
  onBack, 
  onFinish, 
  onFileSelect,
  isSubmitting 
}: CaseDocumentsStepProps) {
  return (
    <div className="space-y-6">
      <DocumentUploader 
        optional={true}
        onSuccess={onFileSelect}
      />
      
      <div className="flex gap-4 pt-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1"
        >
          Voltar
        </Button>
        <Button 
          onClick={onFinish}
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? 'Criando caso...' : 'Finalizar'}
        </Button>
      </div>
    </div>
  );
}
