
import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { CaseCard } from './CaseCard';
import { Case } from "@/types/case";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface CaseGridProps {
  cases: Case[];
  searchTerm: string;
  statusFilter: string;
  areaFilter: string;
}

const MotionCard = motion(Card);
const MotionLink = motion(Link);

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
    toast.info("Criando novo caso", {
      description: "Redirecionando para o formulário de criação"
    });
  };

  const formatAreaName = (area: string) => {
    if (area === 'civil') return 'Direito Civil';
    if (area === 'penal') return 'Direito Penal';
    if (area === 'trabalhista') return 'Direito Trabalhista';
    if (area === 'administrativo') return 'Direito Administrativo';
    if (area === 'tributario') return 'Direito Tributário';
    if (area === 'empresarial') return 'Direito Empresarial';
    if (area === 'consumidor') return 'Direito do Consumidor';
    if (area === 'ambiental') return 'Direito Ambiental';
    return area;
  };

  if (filteredCases?.length === 0) {
    return (
      <motion.div 
        className="text-center p-12 bg-muted/20 rounded-lg border border-dashed border-muted"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FileText className="mx-auto h-16 w-16 text-muted-foreground/60" />
        <h3 className="mt-4 text-xl font-medium">Nenhum caso encontrado</h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          {searchTerm || statusFilter !== 'all' || areaFilter !== 'all' 
            ? "Nenhum caso corresponde aos filtros aplicados. Tente ajustar seus critérios de busca." 
            : "Você ainda não tem casos cadastrados. Crie seu primeiro caso agora mesmo."}
        </p>
        <MotionLink to="/novo-caso" className="mt-6 inline-block"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button onClick={handleNewCase} className="shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Criar novo caso
          </Button>
        </MotionLink>
      </motion.div>
    );
  }

  if (shouldGroupByArea) {
    // Show cases grouped by area
    return (
      <div className="space-y-8">
        {Object.entries(casesByArea).map(([area, areaCases], index) => (
          <MotionCard 
            key={area} 
            className="border-muted/30 shadow-sm hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-serif text-evji-primary">
                {formatAreaName(area)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {areaCases.map((caseItem) => (
                  <CaseCard key={caseItem.id} caseItem={caseItem} />
                ))}
              </div>
            </CardContent>
          </MotionCard>
        ))}
      </div>
    );
  }

  // Default grid view (no grouping)
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {filteredCases?.map((caseItem, index) => (
        <motion.div
          key={caseItem.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <CaseCard caseItem={caseItem} />
        </motion.div>
      ))}
    </motion.div>
  );
}
