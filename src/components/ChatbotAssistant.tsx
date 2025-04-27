
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Paperclip, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export function ChatbotAssistant() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Olá! Sou o assistente jurídico virtual do EVJI. Como posso ajudar na sua rotina de advocacia hoje?',
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
      return 'O próximo prazo importante é para contestação no dia 05/05/2024. Deseja que eu crie um lembrete ou adicione à sua agenda?';
    } else if (userMessage.includes('documento') || userMessage.includes('upload') || userMessage.includes('enviar')) {
      return 'Para enviar documentos, vá até a página de detalhes do caso e clique na aba "Documentos", depois use o botão "Enviar Documento". Posso guiar você por esse processo se desejar.';
    } else if (userMessage.includes('caso') || userMessage.includes('processo')) {
      return 'Você tem 7 casos ativos no momento. O mais recente é "Ação de Indenização por Danos Morais" aberto em 10/04/2024. Gostaria de abrir este caso ou criar um novo?';
    } else if (userMessage.includes('redigir') || userMessage.includes('minuta') || userMessage.includes('contrato')) {
      return 'Posso ajudar a redigir minutas de contratos, petições ou pareceres. Que tipo de documento você precisa criar hoje?';
    } else if (userMessage.includes('cliente') || userMessage.includes('cadastrar cliente')) {
      return 'Para cadastrar ou consultar informações sobre seus clientes, utilize o módulo de clientes. Deseja que eu abra essa página para você?';
    } else if (userMessage.includes('ajuda') || userMessage.includes('funcionalidade')) {
      return 'Posso ajudar você a navegar pelo sistema, analisar documentos, redigir minutas, gerenciar prazos e casos, organizar sua agenda e muito mais. Como advogado, qual área do seu trabalho posso otimizar hoje?';
    } else if (userMessage.includes('olá') || userMessage.includes('oi') || userMessage.includes('bom dia') || userMessage.includes('boa tarde')) {
      return 'Olá! Como advogado, como posso auxiliar você hoje? Posso ajudar com análise de documentos, redação de minutas, gestão de casos ou agenda.';
    } else if (userMessage.includes('analise') || userMessage.includes('documento') || userMessage.includes('análise')) {
      return 'Posso analisar documentos jurídicos, identificar pontos relevantes e sugerir estratégias. Gostaria de fazer upload de um documento para análise ou utilizar um já existente no sistema?';
    }
    
    return 'Como seu assistente jurídico, posso ajudar com análise de documentos, redação de minutas, gerenciamento de prazos ou casos. Poderia me dar mais detalhes sobre sua necessidade específica?';
  };

  const handleNavigate = (path: string) => {
    if (path.includes('caso') || path.includes('processo')) {
      navigate('/cases/list');
    } else if (path.includes('documento') || path.includes('upload')) {
      navigate('/cases/list');
    } else if (path.includes('cliente')) {
      navigate('/clients');
    } else if (path.includes('agenda') || path.includes('prazo')) {
      navigate('/calendar');
    } else if (path.includes('novo')) {
      navigate('/novo-caso');
    } else if (path.includes('chat')) {
      navigate('/webchat');
    }
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

      // If the message suggests navigation, offer a button on next message
      if (newUserMessage.text.toLowerCase().includes('ir para') || newUserMessage.text.toLowerCase().includes('abrir')) {
        setTimeout(() => {
          const navigationMessage: Message = {
            id: (Date.now() + 2).toString(),
            sender: 'bot',
            text: 'Gostaria que eu te redirecione para alguma página específica?',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, navigationMessage]);
        }, 1000);
      }
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
            <div className="font-medium">Assistente Jurídico EVJI</div>
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

                    {/* Add navigation buttons for certain keywords */}
                    {msg.sender === 'bot' && 
                      (msg.text.includes('abra essa página') || msg.text.includes('página para você') || 
                       msg.text.includes('Gostaria que eu te redirecione')) && (
                      <div className="mt-2 space-x-2 flex flex-wrap gap-2">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={() => handleNavigate('caso')}
                          className="text-xs py-0 h-7"
                        >
                          Casos
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={() => handleNavigate('cliente')}
                          className="text-xs py-0 h-7"
                        >
                          Clientes
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={() => handleNavigate('agenda')}
                          className="text-xs py-0 h-7"
                        >
                          Agenda
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={() => handleNavigate('novo')}
                          className="text-xs py-0 h-7"
                        >
                          Novo Caso
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={() => handleNavigate('chat')}
                          className="text-xs py-0 h-7"
                        >
                          Chat Completo
                        </Button>
                      </div>
                    )}
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
                placeholder="Digite sua dúvida jurídica..."
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
