
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatMessages } from '@/components/chat/ChatMessages';
import { ChatTips } from '@/components/chat/ChatTips';
import { ChatSuggestions } from '@/components/chat/ChatSuggestions';
import { ChatUploader } from '@/components/chat/ChatUploader';
import { useWebChat } from '@/hooks/useWebChat';
import { useDocuments } from '@/hooks/useDocuments';
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
      
      toast.success('Documento enviado com sucesso!', {
        description: `${selectedFile.name} foi anexado ao caso e está sendo analisado.`
      });
      
      setSelectedFile(null);
      setShowUploader(false);

      setTimeout(() => {
        const agentResponse = {
          id: `agent-${Date.now()}`,
          text: `Recebi o documento "${selectedFile.name}". Gostaria que eu fizesse uma análise preliminar deste documento ou o associe a um caso específico?`,
          sender: 'agent',
          timestamp: new Date(),
          agentType: activeAgent,
          action: 'document_analysis'
        };
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
          {showTips && <ChatTips onHide={hideTips} />}
          
          <ChatMessages 
            messages={messages}
            messagesEndRef={messagesEndRef}
          />
          
          {showUploader && (
            <ChatUploader 
              selectedFile={selectedFile}
              isUploading={isUploading}
              onFileSelect={handleFileSelect}
              onUpload={handleUploadDocument}
              onClose={toggleUploader}
              onRemoveFile={() => setSelectedFile(null)}
            />
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-3 pb-3">
        <div className="w-full space-y-3">
          {!showUploader && (
            <ChatSuggestions onSuggestionClick={setNewMessage} />
          )}
          
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
