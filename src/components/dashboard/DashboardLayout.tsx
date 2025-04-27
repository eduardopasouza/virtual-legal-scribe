
import { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { ChatbotAssistant } from '@/components/ChatbotAssistant';
import { DashboardMobileMenu } from './DashboardMobileMenu';
import { useMobileContext } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isMobile, toggleSidebar, sidebarOpen } = useMobileContext();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <div 
          className={`sidebar-container h-[calc(100vh-4rem)] sticky top-16 z-30 transition-all duration-300 ease-in-out
            ${isMobile ? (sidebarOpen ? 'w-64' : 'w-0') : 'w-auto'}`}
        >
          <Sidebar />
        </div>
        {isMobile && <DashboardMobileMenu onToggle={toggleSidebar} />}
        <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-clean p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
            {children}
          </div>
          <Footer />
        </main>
      </div>
      <ChatbotAssistant />
    </div>
  );
};
