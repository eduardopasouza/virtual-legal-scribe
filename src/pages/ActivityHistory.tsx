
import React from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ActivityFilters } from '@/components/history/ActivityFilters';
import { ActivityTimeline } from '@/components/history/ActivityTimeline';
import { ActivityList } from '@/components/history/ActivityList';
import { ActivityDialog } from '@/components/history/ActivityDialog';
import { useActivityHistory } from '@/hooks/useActivityHistory';
import { Skeleton } from "@/components/ui/skeleton";
import { NavigationBreadcrumbs } from '@/components/NavigationBreadcrumbs';

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
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <NavigationBreadcrumbs
              items={[
                { label: 'Início', href: '/' },
                { label: 'Histórico de Atividades', href: '/activity-history' },
              ]}
            />
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
        
        <Tabs defaultValue="timeline">
          <TabsList>
            <TabsTrigger value="timeline">
              <Clock className="h-4 w-4 mr-2" />
              Linha do Tempo
            </TabsTrigger>
            <TabsTrigger value="list">
              <FileText className="h-4 w-4 mr-2" />
              Lista
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="mt-6">
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px flex-1 bg-border"></div>
                      <Skeleton className="h-5 w-48" />
                      <div className="h-px flex-1 bg-border"></div>
                    </div>
                    <div className="space-y-4">
                      {[1, 2].map(j => (
                        <div key={j} className="relative pl-8">
                          <Skeleton className="absolute left-0 top-1.5 w-4 h-4 rounded-full" />
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex justify-between mb-2">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-4 w-12" />
                              </div>
                              <Skeleton className="h-4 w-60 mb-2" />
                              <Skeleton className="h-4 w-full" />
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ActivityTimeline 
                activities={groupedActivities}
                onViewDetails={handleViewDetails}
              />
            )}
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            {isLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex items-start gap-3">
                        <Skeleton className="w-1 h-16 rounded-full" />
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <Skeleton className="h-5 w-40" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <Skeleton className="h-4 w-60 mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <div className="flex gap-2">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <ActivityList 
                activities={activities}
                onViewDetails={handleViewDetails}
              />
            )}
          </TabsContent>
        </Tabs>
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
