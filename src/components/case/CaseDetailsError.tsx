
import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';

export function CaseDetailsError() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="text-center p-12">
            <p className="text-red-500">Erro ao carregar detalhes do caso.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
