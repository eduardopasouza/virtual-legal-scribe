
import React from 'react';
import { Message } from '@/types/agent-chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { Loader2 } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

export function ChatMessages({
  messages,
  messagesEndRef,
  isLoading = false,
  emptyState
}: ChatMessagesProps) {
  // Highlight legal terms in messages
  const highlightLegalTerms = (text: string) => {
    // This is a simplified version, in production you'd want a more comprehensive legal term dictionary
    const legalTerms = [
      'habeas corpus', 'mandado de segurança', 'liminar', 'tutela antecipada',
      'recurso', 'agravo', 'apelação', 'embargos', 'petição inicial',
      'contestação', 'réplica', 'sentença', 'acórdão', 'jurisprudência'
    ];
    
    let highlightedText = text;
    
    legalTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      highlightedText = highlightedText.replace(
        regex, 
        match => `<span class="font-medium text-evji-primary">${match}</span>`
      );
    });
    
    return highlightedText;
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Carregando mensagens...</p>
        </div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        {emptyState || (
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Inicie uma conversa com nosso assistente jurídico para obter ajuda com suas questões legais.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={{
              ...message,
              // If the message contains legal terms, highlight them
              text: message.sender === 'agent' ? highlightLegalTerms(message.text) : message.text
            }} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
