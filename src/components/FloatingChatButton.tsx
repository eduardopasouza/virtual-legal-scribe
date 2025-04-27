
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { WebChat } from './WebChat';

export function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-[400px] h-[600px] shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <CardTitle className="text-lg font-medium">Assistente EVJI</CardTitle>
            <Button variant="ghost" size="sm" onClick={toggleChat} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100%-112px)]">
            <WebChat />
          </CardContent>
        </Card>
      ) : (
        <Button 
          onClick={toggleChat} 
          className="h-14 w-14 rounded-full shadow-lg bg-evji-primary hover:bg-evji-primary/90 p-0 flex items-center justify-center"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
