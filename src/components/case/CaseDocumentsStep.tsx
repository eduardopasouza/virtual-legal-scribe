
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { DocumentUploader } from '@/components/DocumentUploader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
      <Card>
        <CardHeader>
          <CardTitle>Documentos do Caso</CardTitle>
          <CardDescription>
            Carregue documentos relacionados ao caso para que nossos agentes possam analisá-los.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentUploader
            optional
            onSuccess={(files) => onFileSelect(files)}
          />
        </CardContent>
      </Card>

      <Alert className="bg-blue-50 border-blue-200">
        <HelpCircle className="h-4 w-4" />
        <AlertTitle>Como funciona?</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-2">
            Após criar o caso, nossos agentes de IA analisarão seus documentos e você poderá:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Conversar diretamente com diferentes especialistas pelo chat</li>
            <li>Receber alertas e notificações sobre o progresso</li>
            <li>Adicionar informações e documentos adicionais a qualquer momento</li>
            <li>Acompanhar cada etapa do workflow em tempo real</li>
            <li>Fazer perguntas e sugestões durante todo o processo</li>
          </ul>
        </AlertDescription>
      </Alert>

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
