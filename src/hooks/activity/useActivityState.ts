
import { useState } from 'react';
import { Activity, ActivityType } from '@/types/history';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

export const useActivityState = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('newest');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  
  const { toast } = useToast();

  const handleViewDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setDialogOpen(true);
  };

  return {
    activities,
    setActivities,
    isLoading,
    setIsLoading,
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
    handleViewDetails,
    toast
  };
};
