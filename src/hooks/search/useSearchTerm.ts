
import { useState, useCallback } from 'react';
import { toast } from "sonner";

export function useSearchTerm() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      toast.info(`Buscando por "${searchTerm}"`, {
        description: "Resultados filtrados conforme sua pesquisa"
      });
    }
  }, [searchTerm]);

  return {
    searchTerm,
    activeTab,
    setActiveTab,
    handleSearchChange,
    handleSearchSubmit
  };
}
