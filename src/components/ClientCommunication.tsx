
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClientCommunication } from '@/hooks/workflow/useClientCommunication';
import { Loader2, BookOpen, MessageSquare, HelpCircle, Users, Check } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

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
    
    // Clear the form after submission
    setFeedbackContent('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Comunicação com Cliente</h2>
        
        {!communication && (
          <Button 
            onClick={handleGenerateCommunication} 
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando comunicação...
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                Preparar comunicação para cliente
              </>
            )}
          </Button>
        )}
      </div>

      {!communication && !isGenerating ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p>Após a finalização do documento, você pode gerar materiais de comunicação para o cliente.</p>
            <p className="mt-2">Isso incluirá um resumo executivo, explicações de termos jurídicos e respostas para perguntas comuns.</p>
          </CardContent>
        </Card>
      ) : communication ? (
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
              
              <TabsContent value="summary" className="space-y-4 mt-4">
                <div className="bg-muted/40 p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Resumo Executivo</h3>
                  <p>{communication.documentSummary}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Explicação Simplificada</h3>
                  <p>{communication.simplifiedExplanation}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Pontos Principais</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {communication.keyPoints.map((point, index) => (
                      <li key={index} className="pl-2">{point}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="terms" className="mt-4">
                <div className="space-y-4">
                  <h3 className="font-semibold">Glossário de Termos Jurídicos</h3>
                  <p className="text-sm text-muted-foreground">
                    Explicações de termos técnicos utilizados no documento:
                  </p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {communication.technicalTermsExplained.map((item, index) => (
                      <AccordionItem key={index} value={`term-${index}`}>
                        <AccordionTrigger className="font-medium">
                          {item.term}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p>{item.explanation}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
              
              <TabsContent value="qa" className="mt-4">
                <div className="space-y-4">
                  <h3 className="font-semibold">Perguntas Frequentes</h3>
                  <p className="text-sm text-muted-foreground">
                    Respostas para possíveis dúvidas do cliente:
                  </p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {communication.anticipatedQuestions.map((qa, index) => (
                      <AccordionItem key={index} value={`qa-${index}`}>
                        <AccordionTrigger className="font-medium text-left">
                          {qa.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p>{qa.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col border-t pt-6">
            <div className="w-full space-y-4">
              <h3 className="font-semibold">Registrar Feedback do Cliente</h3>
              
              <div className="space-y-4">
                <RadioGroup 
                  value={feedbackType} 
                  onValueChange={(value) => setFeedbackType(value as any)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="question" id="question" />
                    <Label htmlFor="question">Dúvida</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="correction" id="correction" />
                    <Label htmlFor="correction">Correção</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="approval" id="approval" />
                    <Label htmlFor="approval">Aprovação</Label>
                  </div>
                </RadioGroup>
                
                <Textarea
                  placeholder={
                    feedbackType === 'question' 
                      ? "Digite a dúvida do cliente..." 
                      : feedbackType === 'correction' 
                      ? "Digite a correção solicitada..." 
                      : "Comentários sobre a aprovação..."
                  }
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                  className="min-h-[100px]"
                />
                
                <Button 
                  onClick={handleSubmitFeedback} 
                  disabled={!feedbackContent.trim() || isRecordingFeedback}
                  className="w-full"
                >
                  {isRecordingFeedback ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Registrar Feedback
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card className="min-h-[300px] flex items-center justify-center">
          <CardContent className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Gerando comunicação para o cliente...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Preparando resumo, explicações e materiais de apresentação
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
