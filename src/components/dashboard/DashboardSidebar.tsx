
import React from 'react';
import { Alerts } from './sidebar/Alerts';
import { UpcomingEvents } from './sidebar/UpcomingEvents';
import { DatabaseAccess } from './sidebar/DatabaseAccess';

export function DashboardSidebar() {
  return (
    <div className="space-y-6">
      <Alerts />
      <UpcomingEvents />
      <DatabaseAccess />
    </div>
  );
}
