
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Check } from "lucide-react";

interface FeedbackFormProps {
  feedbackType: 'question' | 'correction' | 'approval';
  feedbackContent: string;
  isRecordingFeedback: boolean;
  onTypeChange: (value: 'question' | 'correction' | 'approval') => void;
  onContentChange: (content: string) => void;
  onSubmit: () => void;
}

export function FeedbackForm({
  feedbackType,
  feedbackContent,
  isRecordingFeedback,
  onTypeChange,
  onContentChange,
  onSubmit
}: FeedbackFormProps) {
  return (
    <div className="w-full space-y-4">
      <h3 className="font-semibold">Registrar Feedback do Cliente</h3>
      
      <div className="space-y-4">
        <RadioGroup 
          value={feedbackType} 
          onValueChange={(value) => onTypeChange(value as any)}
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
          onChange={(e) => onContentChange(e.target.value)}
          className="min-h-[100px]"
        />
        
        <Button 
          onClick={onSubmit} 
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
  );
}
