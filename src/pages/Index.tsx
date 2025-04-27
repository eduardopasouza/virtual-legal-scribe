
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/DashboardStats';
import { QuickAccess } from '@/components/dashboard/QuickAccess';
import { OngoingActivities } from '@/components/dashboard/OngoingActivities';
import { SystemGuide } from '@/components/dashboard/SystemGuide';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Toaster as Sonner } from '@/components/ui/sonner';

const Index = () => {
  return (
    <DashboardLayout>
      <DashboardHeader />
      <DashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <QuickAccess />
          <OngoingActivities />
          <SystemGuide />
        </div>
        <div className="space-y-4 lg:space-y-6">
          <DashboardSidebar />
        </div>
      </div>
      <Sonner />
    </DashboardLayout>
  );
};

export default Index;
