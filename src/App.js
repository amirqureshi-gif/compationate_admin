import React from 'react';
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom';

import BrandLogo from './components/BrandLogo';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import WebsiteContentPage from './pages/WebsiteContentPage';

import { useAuth } from './state/auth';

function IconDashboard() {
  return (
    <svg className="nav__glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 13h6V4H4v9zm10 7h6V11h-6v9zM4 21h6v-6H4v6zm10-13h6V4h-6v4z" strokeLinejoin="round" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg className="nav__glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        strokeLinecap="round"
      />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg className="nav__glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}

function Shell({ children }) {
  const { me, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="sidebar__brand">
          <BrandLogo height={42} className="sidebar__logoImg" />
          <div className="sidebar__brandText">
            <span className="sidebar__title">Compassionate Alliance</span>
            <span className="sidebar__badge">Admin</span>
          </div>
        </div>

        <nav className="nav">
          <NavLink
            className={({ isActive }) => (isActive ? 'nav__link nav__link--active' : 'nav__link')}
            to="/"
            end
          >
            <IconDashboard />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? 'nav__link nav__link--active' : 'nav__link')}
            to="/website"
          >
            <IconGlobe />
            <span>Website</span>
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? 'nav__link nav__link--active' : 'nav__link')}
            to="/settings"
          >
            <IconSettings />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="sidebar__footer">
          <div className="userCard">
            <div className="userCard__avatar" aria-hidden>
              {(me?.email && me.email[0].toUpperCase()) || 'A'}
            </div>
            <div className="userCard__meta">
              <div className="userCard__label">Signed in</div>
              <div className="userCard__email" title={me?.email || ''}>
                {me?.email || 'Admin'}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
            }}
          >
            Log out
          </button>
        </div>
      </aside>

      <div className="shell__main">
        <div className="mainSurface">{children}</div>
      </div>
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
      <Route
        path="*"
        element={
          <div className="emptyState">
            <h1 className="emptyState__title">Page not found</h1>
            <p className="emptyState__text">The page you asked for does not exist.</p>
            <a className="btn btn--primary" href="/">
              Go to dashboard
            </a>
          </div>
        }
      />
    </Routes>
  );
}
