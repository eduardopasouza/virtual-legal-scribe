
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Menu, Plus, Folder } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useMobileContext } from '@/hooks/use-mobile';
import { NotificationSystem } from '@/components/notification/NotificationSystem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavigationBreadcrumbs } from '@/components/NavigationBreadcrumbs';
import { toast } from "sonner";

export function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSidebar } = useMobileContext();

  const handleNewCase = () => {
    navigate('/novo-caso');
    toast.success("Criando novo caso", {
      description: "Redirecionando para o formulário de criação"
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchTerm = formData.get('search') as string;
    
    if (searchTerm && searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      toast.info("Busca iniciada", {
        description: `Buscando por "${searchTerm}"`
      });
    }
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
          <form className="flex-1 max-w-md" onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                name="search"
                type="search"
                placeholder="Buscar casos, documentos, clientes... (Enter para busca avançada)"
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
            <Folder className="mr-2 h-4 w-4" />
            <Plus className="h-4 w-4" />
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
      
      {location.pathname !== '/' && (
        <div className="px-4 py-2 border-b">
          <NavigationBreadcrumbs />
        </div>
      )}
    </header>
  );
}
