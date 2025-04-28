
import { ReactNode, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { ChatbotAssistant } from '@/components/ChatbotAssistant';
import { DashboardMobileMenu } from './DashboardMobileMenu';
import { useMobileContext } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isMobile, toggleSidebar, sidebarOpen, setSidebarOpen } = useMobileContext();
  
  useEffect(() => {
    // Verificar se estamos em uma página que precisa de mais espaço
    const isSpecialPage = window.location.pathname.includes('/case/') || 
                          window.location.pathname.includes('/novo-caso');
    if (isSpecialPage && !isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile, setSidebarOpen]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar container com transição suave */}
        <div 
          className={`sidebar-container h-[calc(100vh-4rem)] sticky top-16 z-30 transition-all duration-300 ease-in-out
            ${isMobile ? (sidebarOpen ? 'w-64' : 'w-0') : (sidebarOpen ? 'w-64' : 'w-20')}`}
        >
          <Sidebar collapsed={!sidebarOpen && !isMobile} />
        </div>
        
        {/* Botão de toggle da sidebar (visível apenas em desktop) */}
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-0 top-4 z-50 bg-background/80 border border-border rounded-r-full shadow-sm w-6 h-24"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}
        
        {/* Mobile menu toggle */}
        {isMobile && <DashboardMobileMenu onToggle={toggleSidebar} />}
        
        {/* Conteúdo principal */}
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
