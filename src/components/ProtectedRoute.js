import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../state/auth';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="appLoading">
        <div className="appLoading__card" role="status" aria-live="polite">
          <span className="appLoading__spinner" aria-hidden />
          <span>Loading…</span>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

