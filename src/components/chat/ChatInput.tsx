
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Paperclip } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isProcessing?: boolean;
  placeholder?: string;
  onAttachmentClick?: () => void;
  showAttachmentButton?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onKeyPress,
  isProcessing = false,
  placeholder = "Digite sua consulta jurídica...",
  onAttachmentClick,
  showAttachmentButton = false
}: ChatInputProps) {
  return (
    <div className="flex w-full items-center space-x-2">
      {showAttachmentButton && onAttachmentClick && (
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          className="h-9 w-9"
          onClick={onAttachmentClick}
          title="Enviar documento para análise"
        >
          <Paperclip className="h-4 w-4" />
          <span className="sr-only">Enviar documento para análise</span>
        </Button>
      )}
      
      <Input
        value={value}
        onChange={onChange}
        onKeyDown={onKeyPress}
        placeholder={placeholder}
        disabled={isProcessing}
        className="flex-1"
        aria-label="Digite sua mensagem para o assistente jurídico"
      />
      
      <Button 
        type="button" 
        size="icon" 
        onClick={onSend} 
        disabled={isProcessing || !value.trim()}
        className="h-9 w-9"
        title={isProcessing ? "Processando..." : "Enviar mensagem"}
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="sr-only">Enviar mensagem</span>
      </Button>
    </div>
  );
}
