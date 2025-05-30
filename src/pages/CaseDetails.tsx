
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useCaseDetails } from '@/hooks/useCaseDetails';
import { CaseDetailsLoading } from '@/components/case/CaseDetailsLoading';
import { CaseDetailsError } from '@/components/case/CaseDetailsError';
import { CaseDetailsContent } from '@/components/case/CaseDetailsContent';

export default function CaseDetails() {
  const { caseId } = useParams<{ caseId: string }>();
  const { caseData, activities, deadlines, workflowStages, alerts, documents, isLoading, isLoadingActivities } = useCaseDetails(caseId);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Prevent auto-scrolling when the page loads
  useEffect(() => {
    // Reset window scroll position when component mounts
    window.scrollTo(0, 0);
    document.body.style.scrollBehavior = 'auto';
    
    // Reset the content container scroll position if it exists
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    
    // Cleanup function to restore default scroll behavior
    return () => {
      document.body.style.scrollBehavior = '';
    };
  }, [caseId]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <CaseDetailsLoading />
      </DashboardLayout>
    );
  }

  if (!caseData) {
    return (
      <DashboardLayout>
        <CaseDetailsError />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="overflow-y-auto h-full scrollbar-clean" ref={contentRef}>
        <CaseDetailsContent 
          caseId={caseId}
          caseData={caseData}
          activities={activities}
          deadlines={deadlines}
          workflowStages={workflowStages}
          alerts={alerts}
          documents={documents}
          isLoadingActivities={isLoadingActivities}
        />
      </div>
    </DashboardLayout>
  );
}
