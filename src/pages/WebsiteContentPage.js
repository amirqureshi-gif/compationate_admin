import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { apiFetch } from '../api/client';
import { useAuth } from '../state/auth';

export default function WebsiteContentPage() {
  const { token } = useAuth();
  const [keys, setKeys] = useState([]);
  const [sections, setSections] = useState(null);
  const [selectedKey, setSelectedKey] = useState('');
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError('');
    setNotice('');
    setLoading(true);
    try {
      const payload = await apiFetch('admin/site', { token, method: 'GET' });
      setSections(payload && payload.sections ? payload.sections : null);
      const nextKeys = Array.isArray(payload && payload.keys) ? payload.keys : [];
      setKeys(nextKeys);
      setSelectedKey((k) => {
        if (k && nextKeys.includes(k)) return k;
        return nextKeys[0] || '';
      });
    } catch (e) {
      setError(e?.message || 'Failed to load website content');
      setSections(null);
      setKeys([]);
      setSelectedKey('');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!selectedKey || !sections) return;
    const value = sections[selectedKey];
    try {
      setDraft(JSON.stringify(value, null, 2));
    } catch {
      setDraft('');
    }
  }, [selectedKey, sections]);

  const canSave = useMemo(() => Boolean(selectedKey && draft && token), [selectedKey, draft, token]);

  async function onSave() {
    setError('');
    setNotice('');
    let parsed;
    try {
      parsed = JSON.parse(draft);
    } catch {
      setError('Invalid JSON. Fix syntax errors before saving.');
      return;
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      setError('JSON must be an object (not an array or primitive).');
      return;
    }

    setSaving(true);
    try {
      await apiFetch(`admin/site/${encodeURIComponent(selectedKey)}`, {
        token,
        method: 'PUT',
        body: { data: parsed },
      });
      setNotice('Saved. The public website will show this content on the next refresh.');
      await load();
    } catch (e) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title">Website content</h2>
        <div className="page__meta">
          <button type="button" className="btn" onClick={() => load()} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      <p className="muted">
        This JSON is merged with safe defaults on the server, then served publicly at{' '}
        <code className="code">GET /public/site</code>. Icon fields must use Lucide export names (for example{' '}
        <code className="code">Shield</code>, <code className="code">Users</code>).
      </p>

      {error ? (
        <div className="alert alert--error" style={{ marginTop: 12 }}>
          {error}
        </div>
      ) : null}
      {notice ? (
        <div className="alert" style={{ marginTop: 12, borderColor: 'rgba(110, 168, 254, 0.55)' }}>
          {notice}
        </div>
      ) : null}

      <div className="card" style={{ marginTop: 14 }}>
        <div className="card__title">Section</div>
        <div className="card__body" style={{ display: 'grid', gap: 12 }}>
          <label className="field">
            <span className="field__label">Choose section_key</span>
            <select
              className="input"
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              disabled={loading || keys.length === 0}
            >
              {keys.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="field__label">JSON editor</span>
            <textarea
              className="input"
              style={{ minHeight: 420, resize: 'vertical', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              spellCheck={false}
              disabled={loading || !selectedKey}
            />
          </label>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn--primary" disabled={!canSave || saving} onClick={onSave}>
              {saving ? 'Saving…' : 'Save section'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
