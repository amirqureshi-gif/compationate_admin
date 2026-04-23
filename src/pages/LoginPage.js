import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/auth';

function LogoMark({ size = 44 }) {
  return (
    <div className="logoMark" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 64 64" width={size} height={size} role="img">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6ea8fe" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <path
          d="M32 56s-18-10.6-24.2-22.8C3.9 25.4 7.8 14.6 18.6 12c5.7-1.4 10.8.4 13.4 3.7C34.6 12.4 39.7 10.6 45.4 12 56.2 14.6 60.1 25.4 56.2 33.2 50 45.4 32 56 32 56z"
          fill="url(#g)"
          opacity="0.95"
        />
        <path
          d="M18 34c5-1 8-4 10-9 2 5 5 8 10 9-5 1-8 4-10 9-2-5-5-8-10-9z"
          fill="rgba(255,255,255,0.92)"
        />
      </svg>
    </div>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    return (location.state && location.state.from) || '/';
  }, [location.state]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__brand">
          <LogoMark />
          <div>
            <div className="auth__brandTitle">Compassionate Alliance</div>
            <div className="auth__brandSub">Admin panel</div>
          </div>
        </div>
        <h1 className="auth__title">Admin login</h1>
        <p className="auth__hint">
          Sign in to manage CompassionateAlliance website data.
        </p>

        {error ? <div className="alert alert--error">{error}</div> : null}

        <form onSubmit={onSubmit} className="form">
          <label className="field">
            <span className="field__label">Email</span>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              inputMode="email"
              required
            />
          </label>

          <label className="field">
            <span className="field__label">Password</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          <button className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

