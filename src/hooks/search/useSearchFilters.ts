
import { useState, useCallback } from 'react';
import { toast } from "sonner";

export interface SearchFilters {
  documentFilters: {
    petitions: boolean;
    contracts: boolean;
    appeals: boolean;
  };
  caseFilters: {
    active: boolean;
    concluded: boolean;
    archived: boolean;
  };
  dateFilter: string;
}

export function useSearchFilters() {
  const [filters, setFilters] = useState<SearchFilters>({
    documentFilters: {
      petitions: true,
      contracts: true,
      appeals: true
    },
    caseFilters: {
      active: true,
      concluded: true,
      archived: true
    },
    dateFilter: 'all'
  });
  const [isFiltering, setIsFiltering] = useState(false);

  const handleFilterChange = useCallback((type: keyof SearchFilters, key: string, value: boolean) => {
    setFilters(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value
      }
    }));
  }, []);

  const handleDateFilterChange = useCallback((value: string) => {
    setFilters(prev => ({
      ...prev,
      dateFilter: value
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      documentFilters: {
        petitions: true,
        contracts: true,
        appeals: true
      },
      caseFilters: {
        active: true,
        concluded: true,
        archived: true
      },
      dateFilter: 'all'
    });
    toast.info("Filtros limpos", {
      description: "Todos os filtros foram restaurados para os valores padrão"
    });
  }, []);

  const handleApplyFilters = useCallback(() => {
    setIsFiltering(true);
    toast.info("Filtros aplicados", {
      description: "Resultados filtrados conforme seus critérios"
    });
    setTimeout(() => setIsFiltering(false), 500);
  }, []);

  return {
    filters,
    isFiltering,
    handleFilterChange,
    handleDateFilterChange,
    handleClearFilters,
    handleApplyFilters
  };
}
