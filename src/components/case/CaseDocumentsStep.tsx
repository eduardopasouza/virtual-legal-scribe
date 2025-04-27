
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { DocumentUploader } from '@/components/DocumentUploader';

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
        optional
        onSuccess={(files) => onFileSelect(files)}
      />

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Button 
          onClick={onFinish}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Criando caso...' : 'Finalizar'}
        </Button>
      </div>
    </div>
  );
}
