
import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { SearchInput } from "@/components/search/SearchInput";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchContainer } from "@/components/search/SearchContainer";
import { useSearch } from '@/hooks/useSearch';

const SearchPage = () => {
  const searchProps = useSearch();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <SearchContainer>
          <h1 className="text-2xl font-bold text-evji-primary">Busca Avançada</h1>
          
          <SearchInput
            searchTerm={searchProps.searchTerm}
            onSearchChange={searchProps.handleSearchChange}
            onSearchSubmit={searchProps.handleSearchSubmit}
            filters={searchProps.filters}
            onFilterChange={searchProps.handleFilterChange}
            onDateFilterChange={searchProps.handleDateFilterChange}
            onClearFilters={searchProps.handleClearFilters}
            onApplyFilters={searchProps.handleApplyFilters}
          />
          
          <SearchResults
            searchTerm={searchProps.searchTerm}
            activeTab={searchProps.activeTab}
            setActiveTab={searchProps.setActiveTab}
            filteredDocuments={searchProps.filteredDocuments}
            filteredCases={searchProps.filteredCases}
            filteredClients={searchProps.filteredClients}
          />
        </SearchContainer>
      </div>
    </div>
  );
};

export default SearchPage;
