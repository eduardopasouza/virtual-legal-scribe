
import { NavigationBreadcrumbs } from '@/components/NavigationBreadcrumbs';
import { ActivityFilters } from '@/components/history/ActivityFilters';
import type { ActivityFilter } from '@/types/history';

interface ActivityHistoryHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
}

export function ActivityHistoryHeader({
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter,
  typeFilter,
  setTypeFilter,
  sortOrder,
  setSortOrder
}: ActivityHistoryHeaderProps) {
  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: 'Histórico de Atividades', href: '/activity-history' },
  ];
  
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <NavigationBreadcrumbs items={breadcrumbItems} />
        <h1 className="text-2xl font-bold text-evji-primary">Histórico de Atividades</h1>
      </div>
      
      <ActivityFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </div>
  );
}
