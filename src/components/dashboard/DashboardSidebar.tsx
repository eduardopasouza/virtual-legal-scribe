
import React from 'react';
import { Alerts } from './sidebar/Alerts';
import { UpcomingEvents } from './sidebar/UpcomingEvents';
import { DatabaseAccess } from './sidebar/DatabaseAccess';

export function DashboardSidebar() {
  return (
    <div className="sticky top-6 space-y-4 lg:space-y-6 transition-all duration-300 ease-in-out">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4">
        <div className="hover:translate-y-[-2px] transition-transform duration-200">
          <Alerts />
        </div>
        <div className="hover:translate-y-[-2px] transition-transform duration-200">
          <UpcomingEvents />
        </div>
        <div className="hover:translate-y-[-2px] transition-transform duration-200">
          <DatabaseAccess />
        </div>
      </div>
    </div>
  );
}
