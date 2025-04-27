
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClientCommunication } from '@/hooks/workflow/useClientCommunication';
import { Loader2, BookOpen, MessageSquare, HelpCircle, Users } from "lucide-react";
import { CommunicationSummary } from './client-communication/CommunicationSummary';
import { TechnicalTerms } from './client-communication/TechnicalTerms';
import { QuestionsAnswers } from './client-communication/QuestionsAnswers';
import { FeedbackForm } from './client-communication/FeedbackForm';

interface ClientCommunicationProps {
  caseId?: string;
  documentId?: string;
}

export function ClientCommunication({ caseId, documentId }: ClientCommunicationProps) {
  const {
    communication,
    isGenerating,
    generateCommunication,
    recordFeedback,
    isRecordingFeedback
  } = useClientCommunication(caseId);

  const [activeTab, setActiveTab] = useState('summary');
  const [feedbackType, setFeedbackType] = useState<'question' | 'correction' | 'approval'>('question');
  const [feedbackContent, setFeedbackContent] = useState('');

  const handleGenerateCommunication = () => {
    generateCommunication.mutate();
  };

  const handleSubmitFeedback = () => {
    if (!feedbackContent.trim()) return;
    
    recordFeedback.mutate({
      type: feedbackType,
      content: feedbackContent,
      priority: feedbackType === 'correction' ? 'high' : 'medium'
    });
    
    setFeedbackContent('');
  };

  if (!communication && !isGenerating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Comunicação com Cliente</h2>
          <Button onClick={handleGenerateCommunication}>
            <Users className="mr-2 h-4 w-4" />
            Preparar comunicação para cliente
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p>Após a finalização do documento, você pode gerar materiais de comunicação para o cliente.</p>
            <p className="mt-2">Isso incluirá um resumo executivo, explicações de termos jurídicos e respostas para perguntas comuns.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!communication) {
    return (
      <Card className="min-h-[300px] flex items-center justify-center">
        <CardContent className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Gerando comunicação para o cliente...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Preparando resumo, explicações e materiais de apresentação
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Comunicação com Cliente</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Materiais para Comunicação</CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="summary">
                <BookOpen className="h-4 w-4 mr-2" />
                Resumo
              </TabsTrigger>
              <TabsTrigger value="terms">
                <HelpCircle className="h-4 w-4 mr-2" />
                Termos Técnicos
              </TabsTrigger>
              <TabsTrigger value="qa">
                <MessageSquare className="h-4 w-4 mr-2" />
                Perguntas e Respostas
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-4">
              <CommunicationSummary communication={communication} />
            </TabsContent>
            
            <TabsContent value="terms" className="mt-4">
              <TechnicalTerms terms={communication.technicalTermsExplained} />
            </TabsContent>
            
            <TabsContent value="qa" className="mt-4">
              <QuestionsAnswers qa={communication.anticipatedQuestions} />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col border-t pt-6">
          <FeedbackForm
            feedbackType={feedbackType}
            feedbackContent={feedbackContent}
            isRecordingFeedback={isRecordingFeedback}
            onTypeChange={setFeedbackType}
            onContentChange={setFeedbackContent}
            onSubmit={handleSubmitFeedback}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
