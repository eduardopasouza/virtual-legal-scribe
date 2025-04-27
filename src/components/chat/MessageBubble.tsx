
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { Message } from '@/types/agent-chat';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { agentOptions } from '@/constants/agents';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={cn(
          'max-w-[80%] rounded-lg p-3',
          message.sender === 'user'
            ? 'bg-primary text-primary-foreground'
            : message.action === 'request'
            ? 'bg-blue-50 border border-blue-200'
            : message.action === 'confirmation'
            ? 'bg-green-50 border border-green-200'
            : message.action === 'info'
            ? 'bg-amber-50 border border-amber-200'
            : 'bg-muted'
        )}
      >
        <div className="flex items-start gap-2">
          {message.sender === 'agent' && (
            <Avatar className={`h-6 w-6 ${message.action ? 'bg-blue-100' : 'bg-background'}`}>
              <Bot className="h-4 w-4" />
            </Avatar>
          )}
          <div>
            <div className="text-sm whitespace-pre-wrap">{message.text}</div>
            
            {message.metadata && message.action === 'info' && (
              <div className="mt-2 border-t pt-2 text-xs space-y-1">
                {Object.entries(message.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium">{key}:</span>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div className="text-xs mt-1 opacity-70">
              {message.sender === 'agent' && message.agentType && (
                <span className="mr-2">
                  {agentOptions.find(a => a.value === message.agentType)?.label || 'Agente'}
                </span>
              )}
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
          {message.sender === 'user' && (
            <Avatar className="h-6 w-6 bg-background">
              <User className="h-4 w-4" />
            </Avatar>
          )}
        </div>
        
        {message.action === 'confirmation' && (
          <div className="mt-2 flex gap-2 justify-end">
            <Button variant="outline" size="sm">Não agora</Button>
            <Button size="sm">Continuar</Button>
          </div>
        )}
      </div>
    </div>
  );
}
