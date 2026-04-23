import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { apiFetch } from '../api/client';
import { useAuth } from '../state/auth';

function safeString(v) {
  return v === null || v === undefined ? '' : String(v);
}

function ensureArray(v) {
  return Array.isArray(v) ? v : [];
}

function normalizeHero(section) {
  const s = section || {};
  return {
    kicker: safeString(s.kicker),
    titleLine1: safeString(s.titleLine1),
    titleAccent: safeString(s.titleAccent),
    titleSub: safeString(s.titleSub),
    lead: safeString(s.lead),
  };
}

function normalizeTopDonors(section) {
  const s = section || {};
  const donors = ensureArray(s.donors).slice(0, 3).map((d, idx) => ({
    rank: Number(d?.rank || idx + 1),
    name: safeString(d?.name),
    amount: safeString(d?.amount),
    image: safeString(d?.image),
  }));
  while (donors.length < 3) {
    donors.push({ rank: donors.length + 1, name: '', amount: '', image: '' });
  }
  return {
    title: safeString(s.title),
    meta: safeString(s.meta),
    subtitle: safeString(s.subtitle),
    amountBlurbMonth: safeString(s.amountBlurbMonth),
    ctaTitle: safeString(s.ctaTitle),
    ctaText: safeString(s.ctaText),
    donors,
  };
}

function normalizeFooter(section) {
  const s = section || {};
  const phones = ensureArray(s.phones).map((p) => ({
    label: safeString(p?.label),
    href: safeString(p?.href),
  }));
  return {
    about: safeString(s.about),
    email: safeString(s.email),
    emailHref: safeString(s.emailHref),
    address: safeString(s.address),
    phones: phones.length ? phones : [{ label: '', href: '' }],
  };
}

export default function WebsiteContentPage() {
  const { token } = useAuth();
  const [keys, setKeys] = useState([]);
  const [sections, setSections] = useState(null);
  const [selectedKey, setSelectedKey] = useState('');
  const [draft, setDraft] = useState('');
  const [mode, setMode] = useState('forms'); // forms | json
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroForm, setHeroForm] = useState(() => normalizeHero(null));
  const [donorsForm, setDonorsForm] = useState(() => normalizeTopDonors(null));
  const [footerForm, setFooterForm] = useState(() => normalizeFooter(null));

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

    if (selectedKey === 'hero') setHeroForm(normalizeHero(value));
    if (selectedKey === 'top_donors') setDonorsForm(normalizeTopDonors(value));
    if (selectedKey === 'footer') setFooterForm(normalizeFooter(value));
  }, [selectedKey, sections]);

  const canSaveJson = useMemo(() => Boolean(selectedKey && draft && token), [selectedKey, draft, token]);
  const canSaveForms = useMemo(() => Boolean(selectedKey && token), [selectedKey, token]);

  async function saveSection(key, dataObject) {
    await apiFetch(`admin/site/${encodeURIComponent(key)}`, {
      token,
      method: 'PUT',
      body: { data: dataObject },
    });
  }

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
      await saveSection(selectedKey, parsed);
      setNotice('Saved. The public website will show this content on the next refresh.');
      await load();
    } catch (e) {
      setError(e?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function onSaveForm() {
    setError('');
    setNotice('');

    if (!selectedKey) return;
    if (selectedKey !== 'hero' && selectedKey !== 'top_donors' && selectedKey !== 'footer') {
      setError('This section is not available in Forms mode yet. Switch to Advanced (JSON) for now.');
      return;
    }

    setSaving(true);
    try {
      if (selectedKey === 'hero') {
        await saveSection('hero', heroForm);
      } else if (selectedKey === 'top_donors') {
        await saveSection('top_donors', donorsForm);
      } else if (selectedKey === 'footer') {
        await saveSection('footer', footerForm);
      }

      setNotice('Saved. Refresh the public website to see updates.');
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
        Edit website content stored in Postgres via the API. Use <strong>Forms</strong> for user-friendly editing, or{' '}
        switch to <strong>Advanced</strong> to edit raw JSON (power users only).
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

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn ${mode === 'forms' ? 'btn--primary' : ''}`}
              onClick={() => setMode('forms')}
              disabled={loading || !selectedKey}
            >
              Forms
            </button>
            <button
              type="button"
              className={`btn ${mode === 'json' ? 'btn--primary' : ''}`}
              onClick={() => setMode('json')}
              disabled={loading || !selectedKey}
            >
              Advanced (JSON)
            </button>
          </div>

          {mode === 'forms' ? (
            <>
              {selectedKey === 'hero' ? (
                <div className="kv" style={{ gap: 12 }}>
                  <div className="card" style={{ margin: 0 }}>
                    <div className="card__title">Hero</div>
                    <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                      <label className="field">
                        <span className="field__label">Kicker</span>
                        <input
                          className="input"
                          value={heroForm.kicker}
                          onChange={(e) => setHeroForm((s) => ({ ...s, kicker: e.target.value }))}
                        />
                      </label>

                      <label className="field">
                        <span className="field__label">Title (line 1)</span>
                        <input
                          className="input"
                          value={heroForm.titleLine1}
                          onChange={(e) => setHeroForm((s) => ({ ...s, titleLine1: e.target.value }))}
                        />
                      </label>

                      <label className="field">
                        <span className="field__label">Title accent</span>
                        <input
                          className="input"
                          value={heroForm.titleAccent}
                          onChange={(e) => setHeroForm((s) => ({ ...s, titleAccent: e.target.value }))}
                        />
                      </label>

                      <label className="field">
                        <span className="field__label">Title sub</span>
                        <input
                          className="input"
                          value={heroForm.titleSub}
                          onChange={(e) => setHeroForm((s) => ({ ...s, titleSub: e.target.value }))}
                        />
                      </label>

                      <label className="field">
                        <span className="field__label">Lead text</span>
                        <textarea
                          className="input"
                          style={{ minHeight: 110, resize: 'vertical' }}
                          value={heroForm.lead}
                          onChange={(e) => setHeroForm((s) => ({ ...s, lead: e.target.value }))}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedKey === 'top_donors' ? (
                <div className="kv" style={{ gap: 12 }}>
                  <div className="card" style={{ margin: 0 }}>
                    <div className="card__title">Top donors</div>
                    <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label className="field">
                          <span className="field__label">Title</span>
                          <input
                            className="input"
                            value={donorsForm.title}
                            onChange={(e) => setDonorsForm((s) => ({ ...s, title: e.target.value }))}
                          />
                        </label>
                        <label className="field">
                          <span className="field__label">Month label</span>
                          <input
                            className="input"
                            value={donorsForm.meta}
                            onChange={(e) => setDonorsForm((s) => ({ ...s, meta: e.target.value }))}
                          />
                        </label>
                      </div>

                      <label className="field">
                        <span className="field__label">Subtitle</span>
                        <textarea
                          className="input"
                          style={{ minHeight: 90, resize: 'vertical' }}
                          value={donorsForm.subtitle}
                          onChange={(e) => setDonorsForm((s) => ({ ...s, subtitle: e.target.value }))}
                        />
                      </label>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label className="field">
                          <span className="field__label">Amount blurb month</span>
                          <input
                            className="input"
                            value={donorsForm.amountBlurbMonth}
                            onChange={(e) => setDonorsForm((s) => ({ ...s, amountBlurbMonth: e.target.value }))}
                          />
                        </label>
                        <label className="field">
                          <span className="field__label">CTA title</span>
                          <input
                            className="input"
                            value={donorsForm.ctaTitle}
                            onChange={(e) => setDonorsForm((s) => ({ ...s, ctaTitle: e.target.value }))}
                          />
                        </label>
                      </div>

                      <label className="field">
                        <span className="field__label">CTA text</span>
                        <textarea
                          className="input"
                          style={{ minHeight: 90, resize: 'vertical' }}
                          value={donorsForm.ctaText}
                          onChange={(e) => setDonorsForm((s) => ({ ...s, ctaText: e.target.value }))}
                        />
                      </label>

                      <div className="card" style={{ margin: 0 }}>
                        <div className="card__title">Top 3 donors</div>
                        <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                          {donorsForm.donors.map((d, idx) => (
                            <div
                              // eslint-disable-next-line react/no-array-index-key
                              key={idx}
                              style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 12 }}
                            >
                              <label className="field">
                                <span className="field__label">Rank</span>
                                <input
                                  className="input"
                                  inputMode="numeric"
                                  value={d.rank}
                                  onChange={(e) => {
                                    const v = Number(e.target.value || 0);
                                    setDonorsForm((s) => ({
                                      ...s,
                                      donors: s.donors.map((x, i) => (i === idx ? { ...x, rank: v || idx + 1 } : x)),
                                    }));
                                  }}
                                />
                              </label>
                              <label className="field">
                                <span className="field__label">Name</span>
                                <input
                                  className="input"
                                  value={d.name}
                                  onChange={(e) => {
                                    setDonorsForm((s) => ({
                                      ...s,
                                      donors: s.donors.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)),
                                    }));
                                  }}
                                />
                              </label>
                              <label className="field">
                                <span className="field__label">Amount</span>
                                <input
                                  className="input"
                                  value={d.amount}
                                  onChange={(e) => {
                                    setDonorsForm((s) => ({
                                      ...s,
                                      donors: s.donors.map((x, i) => (i === idx ? { ...x, amount: e.target.value } : x)),
                                    }));
                                  }}
                                />
                              </label>
                              <div style={{ gridColumn: '1 / -1' }}>
                                <label className="field">
                                  <span className="field__label">Image URL</span>
                                  <input
                                    className="input"
                                    value={d.image}
                                    onChange={(e) => {
                                      setDonorsForm((s) => ({
                                        ...s,
                                        donors: s.donors.map((x, i) => (i === idx ? { ...x, image: e.target.value } : x)),
                                      }));
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedKey === 'footer' ? (
                <div className="kv" style={{ gap: 12 }}>
                  <div className="card" style={{ margin: 0 }}>
                    <div className="card__title">Footer</div>
                    <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                      <label className="field">
                        <span className="field__label">About</span>
                        <textarea
                          className="input"
                          style={{ minHeight: 110, resize: 'vertical' }}
                          value={footerForm.about}
                          onChange={(e) => setFooterForm((s) => ({ ...s, about: e.target.value }))}
                        />
                      </label>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label className="field">
                          <span className="field__label">Email</span>
                          <input
                            className="input"
                            value={footerForm.email}
                            onChange={(e) => setFooterForm((s) => ({ ...s, email: e.target.value }))}
                          />
                        </label>
                        <label className="field">
                          <span className="field__label">Email link (mailto:)</span>
                          <input
                            className="input"
                            value={footerForm.emailHref}
                            onChange={(e) => setFooterForm((s) => ({ ...s, emailHref: e.target.value }))}
                          />
                        </label>
                      </div>

                      <label className="field">
                        <span className="field__label">Address</span>
                        <input
                          className="input"
                          value={footerForm.address}
                          onChange={(e) => setFooterForm((s) => ({ ...s, address: e.target.value }))}
                        />
                      </label>

                      <div className="card" style={{ margin: 0 }}>
                        <div className="card__title">Emergency phones</div>
                        <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                          {footerForm.phones.map((p, idx) => (
                            <div
                              // eslint-disable-next-line react/no-array-index-key
                              key={idx}
                              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}
                            >
                              <label className="field">
                                <span className="field__label">Label</span>
                                <input
                                  className="input"
                                  value={p.label}
                                  onChange={(e) =>
                                    setFooterForm((s) => ({
                                      ...s,
                                      phones: s.phones.map((x, i) => (i === idx ? { ...x, label: e.target.value } : x)),
                                    }))
                                  }
                                />
                              </label>
                              <label className="field">
                                <span className="field__label">Link (tel:)</span>
                                <input
                                  className="input"
                                  value={p.href}
                                  onChange={(e) =>
                                    setFooterForm((s) => ({
                                      ...s,
                                      phones: s.phones.map((x, i) => (i === idx ? { ...x, href: e.target.value } : x)),
                                    }))
                                  }
                                />
                              </label>
                              <button
                                type="button"
                                className="btn"
                                onClick={() => setFooterForm((s) => ({ ...s, phones: s.phones.filter((_, i) => i !== idx) }))}
                                disabled={footerForm.phones.length <= 1}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <div>
                            <button
                              type="button"
                              className="btn"
                              onClick={() => setFooterForm((s) => ({ ...s, phones: [...s.phones, { label: '', href: '' }] }))}
                            >
                              Add phone
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedKey !== 'hero' && selectedKey !== 'top_donors' && selectedKey !== 'footer' ? (
                <div className="alert" style={{ marginTop: 0 }}>
                  Forms editor for <code className="code">{selectedKey}</code> is coming next. Switch to{' '}
                  <strong>Advanced (JSON)</strong> for now.
                </div>
              ) : null}
            </>
          ) : (
            <label className="field">
              <span className="field__label">JSON editor</span>
              <textarea
                className="input"
                style={{
                  minHeight: 420,
                  resize: 'vertical',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                }}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                spellCheck={false}
                disabled={loading || !selectedKey}
              />
            </label>
          )}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {mode === 'forms' ? (
              <button type="button" className="btn btn--primary" disabled={!canSaveForms || saving} onClick={onSaveForm}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            ) : (
              <button type="button" className="btn btn--primary" disabled={!canSaveJson || saving} onClick={onSave}>
                {saving ? 'Saving…' : 'Save JSON'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
