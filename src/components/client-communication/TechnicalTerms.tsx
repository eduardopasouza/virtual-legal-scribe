
import React from 'react';
import { ClientCommunication } from '@/agents/comunicador/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface TechnicalTermsProps {
  terms: ClientCommunication['technicalTermsExplained'];
}

export function TechnicalTerms({ terms }: TechnicalTermsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Glossário de Termos Jurídicos</h3>
      <p className="text-sm text-muted-foreground">
        Explicações de termos técnicos utilizados no documento:
      </p>
      
      <Accordion type="single" collapsible className="w-full">
        {terms.map((item, index) => (
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
  );
}
