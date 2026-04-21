import React from 'react';
import { Link } from 'react-router-dom';
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
            Edit homepage sections, services, members, activities, and About/SOP copy from the{' '}
            <Link to="/website">Website</Link> screen (stored in Postgres via the API).
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

