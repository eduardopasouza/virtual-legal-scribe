
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Message } from '@/types/agent-chat';
import { agents } from '@/constants/agents';
import { Badge } from '@/components/ui/badge';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAgent = message.sender === 'agent';
  const agent = message.agentType ? agents.find(a => a.type === message.agentType) : null;

  // This allows HTML tags to be rendered from highlighted legal terms
  const createMarkup = (html: string) => {
    return { __html: html };
  };
  
  return (
    <div className={cn(
      "flex gap-3",
      isAgent ? "justify-start" : "justify-end"
    )}>
      {isAgent && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={`/agents/${message.agentType}.png`} alt={agent?.name} />
          <AvatarFallback>
            {agent?.name.substring(0, 2) || 'AI'}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "max-w-[80%]",
        isAgent ? "order-2" : "order-1"
      )}>
        {isAgent && agent && (
          <div className="mb-1 flex items-center gap-1">
            <span className="text-xs font-medium">{agent.name}</span>
            {message.action && (
              <Badge 
                variant={message.action === 'info' ? 'secondary' : 
                       message.action === 'request' ? 'outline' : 'default'} 
                className="text-[10px] px-1 py-0 h-4"
              >
                {message.action === 'info' ? 'Informação' : 
                 message.action === 'request' ? 'Solicitação' : 
                 message.action === 'legal_advice' ? 'Orientação Jurídica' :
                 message.action === 'document_analysis' ? 'Análise Documental' :
                 message.action}
              </Badge>
            )}
          </div>
        )}
        
        <div className={cn(
          "rounded-lg px-4 py-2 inline-block",
          isAgent 
            ? "bg-secondary text-secondary-foreground rounded-tl-none" 
            : "bg-primary text-primary-foreground rounded-tr-none"
        )}>
          <p 
            className="text-sm whitespace-pre-wrap"
            dangerouslySetInnerHTML={createMarkup(message.text)}
          />
          
          {/* Display metadata if present (e.g., document analysis results) */}
          {isAgent && message.metadata && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              {message.metadata.documentAnalysis && (
                <div className="text-xs">
                  <p className="font-medium">Análise do Documento:</p>
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    {message.metadata.documentAnalysis.keyPoints?.map((point: string, idx: number) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {message.metadata.legalReferences && (
                <div className="text-xs mt-2">
                  <p className="font-medium">Referências Legais:</p>
                  <ul className="mt-1 space-y-1">
                    {message.metadata.legalReferences.map((ref: string, idx: number) => (
                      <li key={idx}>{ref}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className={cn(
          "text-xs mt-1 text-muted-foreground",
          isAgent ? "text-left" : "text-right"
        )}>
          {message.timestamp && formatDistanceToNow(new Date(message.timestamp), { 
            addSuffix: true,
            locale: ptBR
          })}
        </div>
      </div>
      
      {!isAgent && (
        <Avatar className="h-8 w-8 mt-1 order-3">
          <AvatarImage src="/avatars/user.png" alt="User" />
          <AvatarFallback>EU</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
