
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Info, CheckCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { chamarAnalistaRequisitos, criarAnalise, atualizarEtapa } from '@/lib/api/agentsApi';

interface CaseActionsProps {
  caseId: string;
  documents: any[];
  caseData: any;
}

export function CaseActions({ caseId, documents, caseData }: CaseActionsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const chamarAnalistaMutation = useMutation({
    mutationFn: async () => {
      if (!caseData || !caseId) throw new Error("Caso não encontrado");
      
      // 1. Chamar analista de requisitos
      const res = await chamarAnalistaRequisitos(documents, caseData);
      
      // 2. Criar análise no banco
      await criarAnalise({ 
        caso_id: caseId, 
        agente: 'analista-requisitos', 
        conteudo: JSON.stringify(res) 
      });
      
      // 3. Atualizar etapas do workflow
      await atualizarEtapa(caseId, 'reception', 'completed');
      await atualizarEtapa(caseId, 'planning', 'in_progress');
      
      return res;
    },
    onSuccess: () => {
      // Exibir toast de sucesso
      toast({
        title: "Triagem concluída",
        description: "O analista de requisitos processou os documentos com sucesso.",
      });
      
      // Atualizar dados na tela
      queryClient.invalidateQueries({ queryKey: ["case", caseId] });
      queryClient.invalidateQueries({ queryKey: ["activities", caseId] });
      queryClient.invalidateQueries({ queryKey: ["workflow_stages", caseId] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao processar triagem",
        description: `Falha na triagem: ${error.message}. Tente novamente.`,
        variant: "destructive",
      });
    }
  });

  return (
    <div className="flex gap-2 flex-wrap">
      <Button 
        onClick={() => chamarAnalistaMutation.mutate()}
        disabled={chamarAnalistaMutation.isPending}
        variant="outline"
      >
        {chamarAnalistaMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <Info className="mr-2 h-4 w-4" />
            Acionar Analista de Requisitos
          </>
        )}
      </Button>
      
      <Button className="bg-evji-primary hover:bg-evji-primary/90">
        <CheckCircle className="mr-2 h-4 w-4" />
        Avançar Etapa
      </Button>
    </div>
  );
}
