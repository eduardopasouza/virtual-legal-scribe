
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, ArrowLeft } from 'lucide-react';
import { useMobileContext } from '@/hooks/use-mobile';
import { NotificationSystem } from './NotificationSystem';

export function Header() {
  const { toggleSidebar } = useMobileContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine if we should show the back button
  const showBackButton = location.pathname !== '/' && location.pathname !== '/cases/list';
  const backDestination = location.pathname.startsWith('/cases/') ? '/cases/list' : '/';

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(backDestination)}
              title="Voltar"
              aria-label="Voltar"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link to="/" className="flex items-center">
            <span className="font-serif font-bold text-2xl text-evji-primary">
              EVJI
            </span>
            <span className="ml-2 text-sm text-muted-foreground hidden md:inline-block">
              Escritório Virtual Jurídico Inteligente
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <NotificationSystem />
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="rounded-full border border-border"
          >
            <Link to="/settings">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted uppercase text-sm">
                U
              </span>
              <span className="sr-only">Perfil</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
