import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/auth';
import BrandLogo from '../components/BrandLogo';

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
    <div className="authPage">
      <div className="authPage__art" aria-hidden="true">
        <div className="authPage__artInner">
          <BrandLogo height={80} className="authPage__mark" />
          <h1 className="authPage__artTitle">Compassionate Alliance</h1>
          <p className="authPage__artLead">
            Manage public website copy, services, and member-facing content in one place—served to visitors from
            your API and database.
          </p>
          <ul className="authPage__points">
            <li>Form-based editing for all main sections</li>
            <li>Changes saved to PostgreSQL via the Compassionate API</li>
            <li>Same branding as the public site</li>
          </ul>
        </div>
      </div>

      <div className="authPage__panel">
        <div className="authCard">
          <div className="authCard__kicker">Administrator access</div>
          <h2 className="authCard__title">Sign in to continue</h2>
          <p className="authCard__hint">Use the credentials provisioned for your Compassionate Alliance admin account.</p>

          {error ? <div className="alert alert--error">{error}</div> : null}

          <form onSubmit={onSubmit} className="form" noValidate>
            <label className="field">
              <span className="field__label">Email</span>
              <input
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                type="email"
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

            <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
        <p className="authPage__legal">Protected area. For authorized staff only.</p>
      </div>
    </div>
  );
}
