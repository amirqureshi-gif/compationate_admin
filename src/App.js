import React from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';

import { useAuth } from './state/auth';

function Shell({ children }) {
  const { me, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand__title">Compantinate Admin</div>
          <div className="brand__sub">CompassionateAlliance</div>
        </div>

        <nav className="nav">
          <Link className="nav__link" to="/">
            Dashboard
          </Link>
          <Link className="nav__link" to="/settings">
            Settings
          </Link>
        </nav>

        <div className="sidebar__footer">
          <div className="user">
            <div className="user__label">Signed in</div>
            <div className="user__value">{me?.email || 'Admin'}</div>
          </div>
          <button
            className="btn btn--secondary"
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="main">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Shell>
              <DashboardPage />
            </Shell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Shell>
              <SettingsPage />
            </Shell>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<div className="page">Not found</div>} />
    </Routes>
  );
}

