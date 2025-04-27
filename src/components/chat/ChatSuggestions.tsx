
import { Button } from "@/components/ui/button";
import { legalSuggestions } from "@/constants/chatSuggestions";

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-1">
      {legalSuggestions.map((suggestion, index) => (
        <Button 
          key={index}
          variant="outline"
          size="sm"
          className="text-xs py-1 h-auto"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
