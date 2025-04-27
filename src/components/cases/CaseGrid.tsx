
import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { CaseCard } from './CaseCard';
import { Case } from "@/types/case";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CaseGridProps {
  cases: Case[];
  searchTerm: string;
  statusFilter: string;
  areaFilter: string;
}

export function CaseGrid({ cases, searchTerm, statusFilter, areaFilter }: CaseGridProps) {
  const filteredCases = cases?.filter(caseItem => {
    const matchesSearch = searchTerm 
      ? caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (caseItem.number && caseItem.number.toLowerCase().includes(searchTerm.toLowerCase())) ||
        caseItem.client.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesStatus = statusFilter === 'all' ? true : caseItem.status === statusFilter;
    const matchesArea = areaFilter === 'all' ? true : caseItem.area_direito === areaFilter;
    
    return matchesSearch && matchesStatus && matchesArea;
  });
  
  // Group cases by area if there are multiple areas
  const casesByArea = React.useMemo(() => {
    if (!filteredCases || filteredCases.length === 0) return {};
    
    return filteredCases.reduce((grouped: Record<string, Case[]>, caseItem) => {
      const area = caseItem.area_direito || 'Não classificado';
      if (!grouped[area]) {
        grouped[area] = [];
      }
      grouped[area].push(caseItem);
      return grouped;
    }, {});
  }, [filteredCases]);
  
  const areMultipleAreas = Object.keys(casesByArea).length > 1;
  const shouldGroupByArea = areMultipleAreas && areaFilter === 'all';

  const handleFilterFeedback = () => {
    if (filteredCases?.length === 0 && (searchTerm || statusFilter !== 'all' || areaFilter !== 'all')) {
      const filters = [];
      if (searchTerm) filters.push(`termo "${searchTerm}"`);
      if (statusFilter !== 'all') filters.push(`status "${statusFilter}"`);
      if (areaFilter !== 'all') filters.push(`área "${areaFilter}"`);
      
      toast.info("Filtros aplicados", { 
        description: `Nenhum caso corresponde aos filtros: ${filters.join(', ')}` 
      });
    }
  };

  React.useEffect(() => {
    handleFilterFeedback();
  }, [searchTerm, statusFilter, areaFilter]);

  const handleNewCase = () => {
    toast.success("Criando novo caso", {
      description: "Redirecionando para o formulário de criação"
    });
  };

  if (filteredCases?.length === 0) {
    return (
      <div className="text-center p-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">Nenhum caso encontrado</h3>
        <p className="text-muted-foreground">
          {searchTerm || statusFilter !== 'all' || areaFilter !== 'all' 
            ? "Nenhum caso corresponde aos filtros aplicados." 
            : "Você ainda não tem casos cadastrados."}
        </p>
        <Link to="/novo-caso" className="mt-4 inline-block">
          <Button onClick={handleNewCase}>
            <Plus className="mr-2 h-4 w-4" />
            Criar novo caso
          </Button>
        </Link>
      </div>
    );
  }

  if (shouldGroupByArea) {
    // Show cases grouped by area
    return (
      <div className="space-y-8">
        {Object.entries(casesByArea).map(([area, areaCases]) => (
          <Card key={area} className="border-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {area === 'civil' ? 'Direito Civil' :
                area === 'penal' ? 'Direito Penal' :
                area === 'trabalhista' ? 'Direito Trabalhista' :
                area === 'administrativo' ? 'Direito Administrativo' :
                area === 'tributario' ? 'Direito Tributário' :
                area === 'empresarial' ? 'Direito Empresarial' :
                area === 'consumidor' ? 'Direito do Consumidor' :
                area === 'ambiental' ? 'Direito Ambiental' :
                area}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {areaCases.map((caseItem) => (
                  <CaseCard key={caseItem.id} caseItem={caseItem} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Default grid view (no grouping)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filteredCases?.map((caseItem) => (
        <CaseCard key={caseItem.id} caseItem={caseItem} />
      ))}
    </div>
  );
}
