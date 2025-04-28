
import { ReactNode, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { ChatbotAssistant } from '@/components/ChatbotAssistant';
import { DashboardMobileMenu } from './DashboardMobileMenu';
import { useMobileContext } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isMobile, toggleSidebar, sidebarOpen, setSidebarOpen } = useMobileContext();
  const location = useLocation();
  
  useEffect(() => {
    // Check if we're on a page that needs more space
    const isSpecialPage = location.pathname.includes('/case/') || 
                          location.pathname.includes('/novo-caso');
    
    // Only auto-collapse on desktop for special pages
    if (isSpecialPage && !isMobile) {
      setSidebarOpen(false);
    } else if (!isSpecialPage && !isMobile) {
      // Expand sidebar for normal pages on desktop
      setSidebarOpen(true);
    }
  }, [location.pathname, isMobile, setSidebarOpen]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar container with smooth transition */}
        <div 
          className={`h-[calc(100vh-4rem)] sticky top-16 z-30 transition-all duration-300 ease-in-out
            ${isMobile ? (sidebarOpen ? 'w-60' : 'w-0') : (sidebarOpen ? 'w-60' : 'w-16')}`}
        >
          <Sidebar collapsed={!sidebarOpen && !isMobile} />
        </div>
        
        {/* Sidebar toggle button (visible only in desktop) */}
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute left-0 top-4 z-50 ml-4 h-8 w-8 rounded-full shadow-sm bg-background hover:bg-muted"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}
        
        {/* Mobile menu toggle */}
        {isMobile && <DashboardMobileMenu onToggle={toggleSidebar} />}
        
        {/* Main content */}
        <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto scrollbar-clean p-4 lg:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
          <Footer />
        </main>
      </div>
      <ChatbotAssistant />
    </div>
  );
}
