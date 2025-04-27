
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Menu, Plus } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useMobile } from '@/hooks/use-mobile';
import { NotificationSystem } from '@/components/NotificationSystem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toggleSidebar } = useMobile();

  const handleNewCase = () => {
    navigate('/novo-caso');
  };

  return (
    <header className="border-b bg-background z-10">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </button>
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center">
              <h2 className="font-serif text-2xl font-bold text-evji-primary">EVJI</h2>
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 flex-1 px-6">
          <form className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar casos, documentos, clientes..."
                className="w-full pl-8"
              />
            </div>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <Button
            size="sm"
            variant="outline"
            className="hidden md:flex"
            onClick={handleNewCase}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Caso
          </Button>

          <NotificationSystem />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full h-8 w-8"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.user_metadata?.avatar_url || ""}
                    alt={user?.user_metadata?.full_name || "User"}
                  />
                  <AvatarFallback>
                    {user?.user_metadata?.full_name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/history')}>
                Histórico
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
