
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useMobileContext } from "@/hooks/use-mobile";

interface DashboardMobileMenuProps {
  onToggle: () => void;
}

export function DashboardMobileMenu({ onToggle }: DashboardMobileMenuProps) {
  const { isMobile, sidebarOpen } = useMobileContext();
  
  if (!isMobile) return null;
  
  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Button 
        size="sm" 
        variant="default" 
        onClick={onToggle}
        className="rounded-full shadow-md"
        aria-label={sidebarOpen ? "Fechar menu lateral" : "Abrir menu lateral"}
      >
        <Menu className="h-4 w-4" />
      </Button>
    </div>
  );
}
