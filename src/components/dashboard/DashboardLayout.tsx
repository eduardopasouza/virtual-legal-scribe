
import { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { ChatbotAssistant } from '@/components/ChatbotAssistant';
import { DashboardMobileMenu } from './DashboardMobileMenu';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <div className="sidebar-container h-[calc(100vh-4rem)] sticky top-16 z-30 hidden lg:block">
          <Sidebar />
        </div>
        <DashboardMobileMenu 
          onToggle={() => {
            const sidebarContainer = document.querySelector('.sidebar-container');
            sidebarContainer?.classList.toggle('hidden');
          }}
        />
        <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-background p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
          <Footer />
        </main>
      </div>
      <ChatbotAssistant />
    </div>
  );
};
