import React from 'react';
import { API_BASE_URL } from '../config';

export default function SettingsPage() {
  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Settings</h2>
        <div className="page__meta">Environment & connectivity</div>
      </div>

      <div className="card">
        <div className="card__title">API base URL</div>
        <div className="card__body">
          <div className="kv">
            <div className="kv__k">REACT_APP_API_BASE_URL</div>
            <div className="kv__v">
              <code className="code">
                {API_BASE_URL || '(not set)'}
              </code>
            </div>
          </div>
          <p className="muted">
            In Railway, set this variable on the Admin service so the build
            knows where your backend API is hosted.
          </p>
        </div>
      </div>
    </div>
  );
}

