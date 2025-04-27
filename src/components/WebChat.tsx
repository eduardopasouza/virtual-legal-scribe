
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
import { Paperclip, X } from 'lucide-react';
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
        text: `Documento "${selectedFile.name}" enviado com sucesso.`,
        sender: 'user',
        timestamp: new Date(),
        isSystemMessage: true
      };
      
      // Set as system message to display differently
      
      toast.success('Documento enviado com sucesso!', {
        description: `${selectedFile.name} foi anexado ao caso.`
      });
      setSelectedFile(null);
      setShowUploader(false);
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

  return (
    <Card className={`flex flex-col ${fullScreen ? 'h-[calc(100vh-8rem)]' : 'h-[600px]'}`}>
      <ChatHeader
        activeAgent={activeAgent}
        onAgentChange={changeAgent}
        currentStage={currentStage}
        clientInfo={clientInfo}
      />
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div className="h-full flex flex-col">
          <ChatMessages 
            messages={messages}
            messagesEndRef={messagesEndRef}
          />
          
          {showUploader && (
            <div className="bg-muted/20 border-t p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Upload de documento</h3>
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
                      {isUploading ? 'Enviando...' : 'Enviar documento'}
                    </Button>
                  </div>
                </div>
              ) : (
                <DropZone onFileSelect={handleFileSelect} disabled={isUploading} />
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
          />
        </div>
      </CardFooter>
    </Card>
  );
}
