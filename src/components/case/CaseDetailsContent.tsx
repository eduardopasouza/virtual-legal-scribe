
import React from 'react';
import { Activity } from '@/types/case';
import { UploadContainer } from '@/components/upload/UploadContainer';
import { ActivityList } from './ActivityList';
import { CaseTimeline } from './CaseTimeline';
import { CaseAlerts } from './CaseAlerts';
import { CaseHeader } from './CaseHeader';

interface CaseDetailsContentProps {
  caseId: string;
  caseData: {
    title: string;
    type: string;
    status: string;
    created_at: string;
  };
  activities: Activity[];
  isLoadingActivities: boolean;
}

export function CaseDetailsContent({ 
  caseId, 
  caseData, 
  activities, 
  isLoadingActivities 
}: CaseDetailsContentProps) {
  return (
    <div className="space-y-6">
      <CaseHeader 
        title={caseData.title}
        type={caseData.type}
        status={caseData.status}
        createdAt={new Date(caseData.created_at)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <UploadContainer caseId={caseId} />
          <ActivityList activities={activities || []} isLoading={isLoadingActivities} />
        </div>
        <div className="space-y-4">
          <CaseTimeline stages={[]} />
          <CaseAlerts alerts={[]} />
        </div>
      </div>
    </div>
  );
}

