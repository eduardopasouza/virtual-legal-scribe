
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { useWebChat } from '@/hooks/useWebChat';
import { DropZone } from '@/components/document/DropZone';
import { useDocuments } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { FilePreview } from '@/components/document/FilePreview';
import { Paperclip, X, Info } from 'lucide-react';
import { toast } from 'sonner';

interface WebChatProps {
  fullScreen?: boolean;
  caseId?: string;
  onClientIdentified?: (clientData: any) => void;
  onWorkflowSelected?: (workflow: string) => void;
  onAgentAssigned?: (agent: any) => void;
}

export function WebChat({ 
  fullScreen = false, 
  caseId,
  onClientIdentified,
  onWorkflowSelected,
  onAgentAssigned
}: WebChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showTips, setShowTips] = useState(!localStorage.getItem('evji_tips_seen'));
  const { uploadDocument, isUploading } = useDocuments(caseId);

  const {
    messages,
    newMessage,
    setNewMessage,
    currentStage,
    activeAgent,
    isProcessing,
    clientInfo,
    handleSendMessage,
    changeAgent
  } = useWebChat(caseId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showUploader]);

  // Display welcome message if this is the first time using the system
  useEffect(() => {
    if (messages.length <= 1 && !localStorage.getItem('evji_welcome_seen')) {
      const timer = setTimeout(() => {
        toast.info('Bem-vindo ao Chat Jurídico EVJI', {
          description: 'Aqui você pode conversar com nossos assistentes especializados em diferentes áreas do direito.',
          duration: 6000,
        });
        localStorage.setItem('evji_welcome_seen', 'true');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleUploadDocument = async () => {
    if (!selectedFile) return;

    try {
      await uploadDocument(selectedFile);
      
      // Add message about document upload
      const uploadMessage = {
        id: `upload-${Date.now()}`,
        text: `Documento "${selectedFile.name}" enviado com sucesso e será analisado pelo sistema.`,
        sender: 'user',
        timestamp: new Date(),
        isSystemMessage: true
      };
      
      // Set as system message to display differently
      
      toast.success('Documento enviado com sucesso!', {
        description: `${selectedFile.name} foi anexado ao caso e está sendo analisado.`
      });
      setSelectedFile(null);
      setShowUploader(false);

      // Simulate assistant response to document
      setTimeout(() => {
        const agentResponse = {
          id: `agent-${Date.now()}`,
          text: `Recebi o documento "${selectedFile.name}". Gostaria que eu fizesse uma análise preliminar deste documento ou o associe a um caso específico?`,
          sender: 'agent',
          timestamp: new Date(),
          agentType: activeAgent
        };
        
        // Add to messages
        const currentMessages = messages || [];
        const newMessages = [...currentMessages, agentResponse];
        // setMessages(newMessages);
      }, 2000);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Falha ao enviar documento', {
        description: 'Ocorreu um erro ao enviar o documento.'
      });
    }
  };

  const toggleUploader = () => {
    setShowUploader(prev => !prev);
    setSelectedFile(null);
  };

  const hideTips = () => {
    setShowTips(false);
    localStorage.setItem('evji_tips_seen', 'true');
  };

  return (
    <Card className={`flex flex-col ${fullScreen ? 'h-[calc(100vh-8rem)]' : 'h-[600px]'}`}>
      <ChatHeader
        activeAgent={activeAgent}
        onAgentChange={changeAgent}
        currentStage={currentStage}
        clientInfo={clientInfo}
      />
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full flex flex-col relative">
          {showTips && (
            <div className="absolute inset-x-0 top-0 bg-blue-50 p-3 z-10 shadow-sm border-b border-blue-100">
              <div className="flex justify-between items-start">
                <div className="flex gap-2 items-start">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-700">Dicas para utilizar o Chat Jurídico:</p>
                    <ul className="list-disc pl-5 text-blue-600 mt-1 space-y-1">
                      <li>Pergunte sobre análise de documentos jurídicos</li>
                      <li>Solicite minutas de contratos ou petições</li>
                      <li>Peça assistência com prazos processuais</li>
                      <li>Troque entre agentes especializados para diferentes tarefas</li>
                    </ul>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={hideTips} className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          <ChatMessages 
            messages={messages}
            messagesEndRef={messagesEndRef}
          />
          
          {showUploader && (
            <div className="bg-muted/20 border-t p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Upload de documento jurídico</h3>
                <Button variant="ghost" size="sm" onClick={toggleUploader}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {selectedFile ? (
                <div className="space-y-3">
                  <FilePreview 
                    file={selectedFile}
                    onRemove={() => setSelectedFile(null)}
                    disabled={isUploading}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm" 
                      onClick={() => setSelectedFile(null)}
                      disabled={isUploading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleUploadDocument}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Enviando...' : 'Enviar para análise'}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    Envie documentos jurídicos como contratos, petições ou documentos processuais para análise automatizada.
                  </p>
                  <DropZone onFileSelect={handleFileSelect} disabled={isUploading} />
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-3 pb-3">
        <div className="w-full">
          <ChatInput
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onSend={handleSendMessage}
            onKeyPress={handleKeyPress}
            isProcessing={isProcessing}
            onAttachmentClick={toggleUploader}
            showAttachmentButton={!showUploader}
            placeholder="Digite sua consulta jurídica..."
          />
        </div>
      </CardFooter>
    </Card>
  );
}
