
import React from 'react';
import { Activity } from '@/types/case';
import { UploadContainer } from '@/components/upload/UploadContainer';
import { ActivityList } from './ActivityList';
import { CaseTimeline } from './CaseTimeline';
import { CaseAlerts } from './CaseAlerts';
import { DocumentList } from './DocumentList';

interface CaseDetailsContentProps {
  caseId: string;
  caseData: any;
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
      <CaseDetailsHeader caseData={caseData} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <UploadContainer caseId={caseId} />
          <ActivityList activities={activities || []} isLoading={isLoadingActivities} />
        </div>
        <div className="space-y-4">
          <CaseTimeline caseId={caseId} />
          <CaseAlerts caseId={caseId} />
          <DocumentList caseId={caseId} />
        </div>
      </div>
    </div>
  );
}
