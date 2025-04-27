
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
}

export function ChatInput({ value, onChange, onSend, onKeyPress, isProcessing }: ChatInputProps) {
  return (
    <div className="flex w-full gap-2">
      <Input
        placeholder="Digite sua mensagem..."
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        disabled={isProcessing}
      />
      <Button
        onClick={onSend}
        disabled={!value.trim() || isProcessing}
      >
        {isProcessing ? (
          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-white" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
