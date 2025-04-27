
import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/DashboardStats';
import { QuickAccess } from '@/components/dashboard/QuickAccess';
import { OngoingActivities } from '@/components/dashboard/OngoingActivities';
import { SystemGuide } from '@/components/dashboard/SystemGuide';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { WebChat } from '@/components/WebChat';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Index = () => {
  // Welcome message that appears automatically
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.info(
        'Bem-vindo ao EVJI',
        {
          description: 'Seu assistente jurídico inteligente está pronto para ajudar. Utilize o chat para começar.',
          duration: 7000,
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
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Assistente EVJI</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] p-0">
              <WebChat fullScreen={false} />
            </CardContent>
          </Card>
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
