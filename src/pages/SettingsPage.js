import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { API_BASE_URL } from '../config';
import { useAuth } from '../state/auth';

export default function SettingsPage() {
  const { token } = useAuth();
  const [formsAdminEmail, setFormsAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiFetch('admin/app-settings', { method: 'GET', token });
        if (!cancelled) setFormsAdminEmail((data && data.formsAdminEmail) || '');
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Failed to load settings');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function save(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    setSaving(true);
    try {
      await apiFetch('admin/app-settings', {
        method: 'PUT',
        token,
        body: { formsAdminEmail: formsAdminEmail.trim() }
      });
      setMessage('Saved. New form notifications will go to this address.');
    } catch (e) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Settings</h2>
        <div className="page__meta">Environment &amp; form delivery</div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card__title">Forms inbox (required for public forms)</div>
        <div className="card__body">
          <p className="muted" style={{ marginTop: 0 }}>
            Membership, support, and donation submissions send a copy here. You can change this anytime. The API
            must have <code className="code">RESEND_API_KEY</code> and (for uploads) <code className="code">CLOUDINARY_URL</code>{' '}
            set on Railway.
          </p>
          {loading ? (
            <p className="muted">Loading…</p>
          ) : (
            <form onSubmit={save} className="form" style={{ maxWidth: 420, marginTop: 12 }}>
              <label className="field">
                <span className="field__label">Admin email (receives all form notifications)</span>
                <input
                  className="input"
                  type="email"
                  name="formsAdminEmail"
                  value={formsAdminEmail}
                  onChange={(e) => setFormsAdminEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </label>
              {error ? <div className="alert alert--error">{error}</div> : null}
              {message ? <div className="alert" style={{ borderColor: 'rgba(22, 163, 74, 0.45)' }}>{message}</div> : null}
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card__title">API base URL (read-only)</div>
        <div className="card__body">
          <div className="kv">
            <div className="kv__k">REACT_APP_API_BASE_URL</div>
            <div className="kv__v">
              <code className="code">{API_BASE_URL || '(not set)'}</code>
            </div>
          </div>
          <p className="muted">Configure this in Railway for the admin service so it can reach the API.</p>
        </div>
      </div>
    </div>
  );
}
