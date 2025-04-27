
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Paperclip, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export function ChatbotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Olá! Sou o assistente virtual do EVJI. Como posso ajudar você hoje?',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const generateResponseBasedOnInput = (userMessage: string): string => {
    userMessage = userMessage.toLowerCase();
    
    if (userMessage.includes('prazo') || userMessage.includes('vencimento')) {
      return 'O próximo prazo importante é para contestação no dia 05/05/2024. Deseja mais informações sobre este prazo?';
    } else if (userMessage.includes('documento') || userMessage.includes('upload') || userMessage.includes('enviar')) {
      return 'Para enviar documentos, vá até a página de detalhes do caso e clique na aba "Documentos", depois use o botão "Enviar Documento".';
    } else if (userMessage.includes('caso') || userMessage.includes('processo')) {
      return 'Você tem 7 casos ativos no momento. O mais recente é "Ação de Indenização por Danos Morais" aberto em 10/04/2024. Deseja ver detalhes deste caso?';
    } else if (userMessage.includes('ajuda') || userMessage.includes('funcionalidade')) {
      return 'Posso ajudar você a navegar pelo sistema, encontrar informações sobre casos, prazos, documentos e muito mais. O que você gostaria de saber especificamente?';
    } else if (userMessage.includes('olá') || userMessage.includes('oi') || userMessage.includes('bom dia') || userMessage.includes('boa tarde')) {
      return 'Olá! Como posso ajudar você hoje?';
    }
    
    return 'Não tenho informações específicas sobre isso. Posso ajudar com prazos, documentos, casos ativos ou navegação pelo sistema. Por favor, seja mais específico ou reformule sua pergunta.';
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simular resposta do bot após um tempo
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: generateResponseBasedOnInput(newUserMessage.text),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Scroll para a última mensagem quando novas mensagens são adicionadas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed right-6 bottom-6 z-50">
      {/* Botão do chatbot */}
      <Button
        onClick={toggleChatbot}
        className="h-14 w-14 rounded-full shadow-lg bg-evji-primary hover:bg-evji-primary/90"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
      
      {/* Janela do chatbot */}
      {isOpen && (
        <Card className="absolute bottom-20 right-0 w-80 md:w-96 h-96 shadow-xl flex flex-col">
          <div className="bg-evji-primary text-white p-3 flex justify-between items-center rounded-t-md">
            <div className="font-medium">Assistente EVJI</div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-evji-primary/80"
              onClick={toggleChatbot}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.sender === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                      msg.sender === 'user'
                        ? "bg-evji-primary text-white rounded-br-none"
                        : "bg-muted rounded-bl-none"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] bg-muted rounded-lg rounded-bl-none px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"></div>
                      <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
                      <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button 
                size="icon" 
                variant="ghost"
                className="text-muted-foreground"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button 
                size="icon"
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="bg-evji-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
