
import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";

interface ChatTipsProps {
  onHide: () => void;
}

export function ChatTips({ onHide }: ChatTipsProps) {
  return (
    <div className="absolute inset-x-0 top-0 bg-blue-50 p-3 z-10 shadow-sm border-b border-blue-100">
      <div className="flex justify-between items-start">
        <div className="flex gap-2 items-start">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-700">Dicas para utilizar o Chat Jurídico:</p>
            <ul className="list-disc pl-5 text-blue-600 mt-1 space-y-1">
              <li>Pergunte sobre análise de documentos jurídicos</li>
              <li>Solicite minutas de contratos ou petições</li>
              <li>Peça assistência com prazos processuais</li>
              <li>Troque entre agentes especializados para diferentes tarefas</li>
            </ul>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onHide} className="h-6 w-6 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
