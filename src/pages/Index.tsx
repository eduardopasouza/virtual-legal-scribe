
import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/DashboardStats';
import { QuickAccess } from '@/components/dashboard/QuickAccess';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { toast } from 'sonner';
import { useCases } from '@/hooks/useCases';
import { DashboardMain } from '@/components/dashboard/sections/DashboardMain';

const Index = () => {
  const { cases, stats, isLoading } = useCases();
  
  // Welcome message that appears automatically with a close button
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.info(
        'Bem-vindo ao EVJI',
        {
          description: 'Seu assistente jurídico inteligente está pronto para ajudar. Utilize o chat para começar.',
          duration: 10000,
          closeButton: true,
        }
      );
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <DashboardHeader />
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <DashboardMain cases={cases} isLoading={isLoading} />
        <div className="space-y-4 lg:space-y-6">
          <DashboardSidebar />
          <QuickAccess />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
