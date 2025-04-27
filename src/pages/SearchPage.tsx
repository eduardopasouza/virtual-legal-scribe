
import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { SearchInput } from "@/components/search/SearchInput";
import { SearchResults } from "@/components/search/SearchResults";
import { useSearch } from '@/hooks/useSearch';

const SearchPage = () => {
  const {
    searchTerm,
    activeTab,
    filters,
    filteredDocuments,
    filteredCases,
    filteredClients,
    handleSearchChange,
    handleSearchSubmit,
    setActiveTab,
    handleFilterChange,
    handleDateFilterChange,
    handleClearFilters,
    handleApplyFilters
  } = useSearch();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-evji-primary">Busca Avançada</h1>
            
            <SearchInput
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onSearchSubmit={handleSearchSubmit}
              filters={{
                documentFilters: filters.documentFilters,
                caseFilters: filters.caseFilters,
                dateFilter: filters.dateFilter
              }}
              onFilterChange={handleFilterChange}
              onDateFilterChange={handleDateFilterChange}
              onClearFilters={handleClearFilters}
              onApplyFilters={handleApplyFilters}
            />
            
            <SearchResults
              searchTerm={searchTerm}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              filteredDocuments={filteredDocuments}
              filteredCases={filteredCases}
              filteredClients={filteredClients}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
