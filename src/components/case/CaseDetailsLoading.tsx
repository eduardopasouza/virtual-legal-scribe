
import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

export function CaseDetailsLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="text-center p-12">
            <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-evji-primary mx-auto"></div>
            <p className="mt-4">Carregando detalhes do caso...</p>
          </div>
        </main>
      </div>
    </div>
  );
}
