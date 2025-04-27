
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { WebChat } from '@/components/WebChat';
import { Button } from "@/components/ui/button";
import { useFeedbackRecording } from '@/hooks/workflow/communication/useFeedbackRecording';
import { useToast } from '@/hooks/use-toast';

interface CaseDraftsProps {
  caseId?: string;
}

export function CaseDrafts({ caseId }: CaseDraftsProps) {
  const [showFeedbackForm, setShowFeedbackForm] = React.useState(false);
  const [feedbackContent, setFeedbackContent] = React.useState('');
  const { mutateAsync: recordFeedback, isPending: isRecordingFeedback } = useFeedbackRecording(caseId);
  const { toast } = useToast();
  
  const handleSubmitFeedback = async () => {
    if (!feedbackContent.trim()) return;
    
    try {
      await recordFeedback({
        type: 'question',
        content: feedbackContent
      });
      
      setFeedbackContent('');
      setShowFeedbackForm(false);
      
      toast({
        title: "Feedback registrado",
        description: "Seu feedback foi enviado para análise."
      });
    } catch (error) {
      console.error('Error recording feedback:', error);
      toast({
        variant: "destructive",
        title: "Erro ao registrar feedback",
        description: "Ocorreu um erro ao enviar seu feedback."
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600" />
          Redação de Documentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Converse com nosso assistente jurídico para elaborar o documento mais adequado para o seu caso.
            O sistema analisará o contexto, objetivos e estratégias para sugerir e redigir o melhor tipo de peça.
          </p>
          
          <WebChat 
            caseId={caseId}
            fullScreen={false}
            onClientIdentified={(clientData) => {
              console.log('Cliente identificado:', clientData);
            }}
            onWorkflowSelected={(workflow) => {
              console.log('Workflow selecionado:', workflow);
            }}
          />
          
          <div className="mt-2 text-xs text-muted-foreground">
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs" 
              onClick={() => setShowFeedbackForm(prev => !prev)}
            >
              Enviar feedback sobre esta funcionalidade
            </Button>
          </div>
          
          {showFeedbackForm && (
            <div className="mt-2 space-y-2">
              <textarea
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
                placeholder="Digite seu feedback ou sugestão..."
                className="w-full rounded-md border border-border p-2 text-sm"
                rows={3}
              />
              <div className="flex justify-end">
                <Button 
                  size="sm" 
                  onClick={handleSubmitFeedback}
                  disabled={!feedbackContent.trim() || isRecordingFeedback}
                >
                  {isRecordingFeedback ? "Enviando..." : "Enviar Feedback"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
