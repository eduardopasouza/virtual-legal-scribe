
import React from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { useSingleCase } from '@/hooks/useCase';
import { useActivitiesList } from '@/hooks/useActivities';
import { CaseDetailsLoading } from '@/components/case/CaseDetailsLoading';
import { CaseDetailsError } from '@/components/case/CaseDetailsError';
import { CaseDetailsContent } from '@/components/case/CaseDetailsContent';

export default function CaseDetails() {
  const { caseId } = useParams<{ caseId: string }>();
  const { caseData, isLoading } = useSingleCase(caseId);
  const { activities, isLoading: isLoadingActivities } = useActivitiesList(caseId);

  if (isLoading) {
    return <CaseDetailsLoading />;
  }

  if (!caseData) {
    return <CaseDetailsError />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <CaseDetailsContent 
            caseId={caseId}
            caseData={caseData} // caseData is already of type Case, which now matches our props
            activities={activities}
            isLoadingActivities={isLoadingActivities}
          />
        </main>
      </div>
    </div>
  );
}
