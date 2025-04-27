
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const DashboardHeader = () => {
  const navigate = useNavigate();
  
  const goToNewCase = () => {
    navigate('/novo-caso');
    toast.success("Iniciando criação de novo caso");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 bg-background/95 backdrop-blur-sm p-2 -mx-2 z-10">
      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-evji-primary">Dashboard</h2>
      <Button 
        className="w-full sm:w-auto bg-evji-primary hover:bg-evji-primary/90 flex items-center gap-2 shadow-sm" 
        onClick={goToNewCase}
      >
        <FileText className="h-4 w-4" />
        Novo Caso
      </Button>
    </div>
  );
};
