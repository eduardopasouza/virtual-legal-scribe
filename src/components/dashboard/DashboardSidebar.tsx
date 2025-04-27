
import React from 'react';
import { Alerts } from './sidebar/Alerts';
import { UpcomingEvents } from './sidebar/UpcomingEvents';
import { DatabaseAccess } from './sidebar/DatabaseAccess';

export function DashboardSidebar() {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4">
        <Alerts />
        <UpcomingEvents />
        <DatabaseAccess />
      </div>
    </div>
  );
}
