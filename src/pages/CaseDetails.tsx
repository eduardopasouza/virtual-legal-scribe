
import React from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useCaseDetails } from '@/hooks/useCaseDetails';
import { CaseDetailsLoading } from '@/components/case/CaseDetailsLoading';
import { CaseDetailsError } from '@/components/case/CaseDetailsError';
import { CaseDetailsContent } from '@/components/case/CaseDetailsContent';

export default function CaseDetails() {
  const { caseId } = useParams<{ caseId: string }>();
  const { caseData, activities, isLoading, isLoadingActivities } = useCaseDetails(caseId);

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
      <CaseDetailsContent 
        caseId={caseId}
        caseData={caseData}
        activities={activities}
        isLoadingActivities={isLoadingActivities}
      />
    </DashboardLayout>
  );
}
