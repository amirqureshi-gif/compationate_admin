import React from 'react';
import { useAuth } from '../state/auth';

export default function DashboardPage() {
  const { me } = useAuth();

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Dashboard</h2>
        <div className="page__meta">
          {me ? `Logged in as ${me.email || 'admin'}` : 'Logged in'}
        </div>
      </div>

      <div className="cards">
        <div className="card">
          <div className="card__title">Website content</div>
          <div className="card__body">
            Connect this panel to your API to manage donations, members, and
            activities.
          </div>
        </div>
        <div className="card">
          <div className="card__title">System status</div>
          <div className="card__body">
            This admin app is ready to deploy on Railway and can be placed on
            <code className="code">admin.compassionatealliance.live</code>.
          </div>
        </div>
      </div>
    </div>
  );
}

