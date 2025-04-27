
import { useSearchFilters } from './search/useSearchFilters';
import { useSearchTerm } from './search/useSearchTerm';
import { useSearchData } from './search/useSearchData';

export function useSearch() {
  const { filters, isFiltering, ...filterActions } = useSearchFilters();
  const { searchTerm, activeTab, setActiveTab, ...searchActions } = useSearchTerm();
  const { documents, cases, clients } = useSearchData();

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredCases = cases.filter(caseItem => 
    caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    searchTerm,
    activeTab,
    filters,
    isFiltering,
    filteredDocuments,
    filteredCases,
    filteredClients,
    setActiveTab,
    ...searchActions,
    ...filterActions
  };
}

export type { SearchFilters } from './search/useSearchFilters';
