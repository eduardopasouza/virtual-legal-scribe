import React, { useMemo } from 'react';
import { Activity, Case } from '@/types/case';
import { UploadContainer } from '@/components/upload/UploadContainer';
import { ActivityList } from './ActivityList';
import { CaseTimeline } from './CaseTimeline';
import { CaseAlerts } from './CaseAlerts';
import { CaseHeader } from './CaseHeader';

interface CaseDetailsContentProps {
  caseId: string;
  caseData: Case;
  activities: Activity[];
  isLoadingActivities: boolean;
}

export const CaseDetailsContent = React.memo(({ 
  caseId, 
  caseData, 
  activities, 
  isLoadingActivities 
}: CaseDetailsContentProps) => {
  const headerData = useMemo(() => ({
    title: caseData.title,
    type: caseData.type || 'Unknown',
    status: caseData.status,
    createdAt: new Date(caseData.created_at)
  }), [caseData]);

  return (
    <div className="space-y-6">
      <CaseHeader {...headerData} />
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
});

CaseDetailsContent.displayName = 'CaseDetailsContent';
