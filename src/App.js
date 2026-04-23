import React from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import WebsiteContentPage from './pages/WebsiteContentPage';

import { useAuth } from './state/auth';

function LogoMark({ size = 34 }) {
  return (
    <div className="logoMark logoMark--small" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 64 64" width={size} height={size} role="img">
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6ea8fe" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <path
          d="M32 56s-18-10.6-24.2-22.8C3.9 25.4 7.8 14.6 18.6 12c5.7-1.4 10.8.4 13.4 3.7C34.6 12.4 39.7 10.6 45.4 12 56.2 14.6 60.1 25.4 56.2 33.2 50 45.4 32 56 32 56z"
          fill="url(#g2)"
          opacity="0.95"
        />
      </svg>
    </div>
  );
}

function Shell({ children }) {
  const { me, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand__row">
            <LogoMark />
            <div>
              <div className="brand__title">Compassionate Admin</div>
              <div className="brand__sub">CompassionateAlliance</div>
            </div>
          </div>
        </div>

        <nav className="nav">
          <Link className="nav__link" to="/">
            Dashboard
          </Link>
          <Link className="nav__link" to="/settings">
            Settings
          </Link>
          <Link className="nav__link" to="/website">
            Website
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
      <Route
        path="/website"
        element={
          <ProtectedRoute>
            <Shell>
              <WebsiteContentPage />
            </Shell>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<div className="page">Not found</div>} />
    </Routes>
  );
}

