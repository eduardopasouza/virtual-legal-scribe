
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ActivityDialog } from '@/components/history/ActivityDialog';
import { ActivityHistoryHeader } from '@/components/history/ActivityHistoryHeader';
import { ActivityHistoryContent } from '@/components/history/ActivityHistoryContent';
import { useActivityHistory } from '@/hooks/useActivityHistory';

const ActivityHistory = () => {
  const {
    groupedActivities,
    activities,
    isLoading,
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    typeFilter,
    setTypeFilter,
    sortOrder,
    setSortOrder,
    selectedActivity,
    dialogOpen,
    setDialogOpen,
    handleViewDetails
  } = useActivityHistory();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ActivityHistoryHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
        
        <ActivityHistoryContent
          isLoading={isLoading}
          groupedActivities={groupedActivities}
          activities={activities}
          onViewDetails={handleViewDetails}
        />
      </div>

      <ActivityDialog 
        activity={selectedActivity} 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
      />
    </DashboardLayout>
  );
};

export default ActivityHistory;
