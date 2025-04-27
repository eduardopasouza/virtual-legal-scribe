
import React from 'react';
import { ClientCommunication } from '@/agents/comunicador/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface QuestionsAnswersProps {
  qa: ClientCommunication['anticipatedQuestions'];
}

export function QuestionsAnswers({ qa }: QuestionsAnswersProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Perguntas Frequentes</h3>
      <p className="text-sm text-muted-foreground">
        Respostas para possíveis dúvidas do cliente:
      </p>
      
      <Accordion type="single" collapsible className="w-full">
        {qa.map((item, index) => (
          <AccordionItem key={index} value={`qa-${index}`}>
            <AccordionTrigger className="font-medium text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <p>{item.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
