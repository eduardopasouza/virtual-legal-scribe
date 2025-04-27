
import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { WebChat } from '@/components/WebChat';

const WebChatPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Chat com Assistentes Jurídicos</h1>
              <p className="text-muted-foreground">
                Converse com nossos assistentes especializados para receber orientação jurídica.
              </p>
            </div>
            
            <div className="h-[calc(100vh-12rem)]">
              <WebChat fullScreen />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WebChatPage;
