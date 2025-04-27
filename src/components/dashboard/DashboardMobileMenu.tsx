
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface DashboardMobileMenuProps {
  onToggle: () => void;
}

export const DashboardMobileMenu = ({ onToggle }: DashboardMobileMenuProps) => {
  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="sm"
        className="p-2 m-2 hover:bg-accent"
        onClick={onToggle}
        aria-label="Toggle menu"
      >
        <FileText className="h-5 w-5" />
      </Button>
    </div>
  );
};
