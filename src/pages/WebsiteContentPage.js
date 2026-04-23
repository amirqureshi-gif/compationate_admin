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

function normalizeManifesto(section) {
  const s = section || {};
  const paragraphs = ensureArray(s.paragraphs).map((p) => ({
    html: safeString(p?.html),
  }));
  const stats = ensureArray(s.stats).map((x) => ({
    icon: safeString(x?.icon),
    tone: safeString(x?.tone),
    title: safeString(x?.title),
    text: safeString(x?.text),
  }));
  return {
    subtitle: safeString(s.subtitle),
    paragraphs: paragraphs.length ? paragraphs : [{ html: '' }],
    stats: stats.length ? stats : [{ icon: 'Users', tone: 'green', title: '', text: '' }],
  };
}

function normalizeCare(section) {
  const s = section || {};
  return {
    eyebrow: safeString(s.eyebrow),
    title: safeString(s.title),
    titleAccent: safeString(s.titleAccent),
    lede: safeString(s.lede),
    subtitlePrefix: safeString(s.subtitlePrefix),
    subtitleHighlight: safeString(s.subtitleHighlight),
    services: ensureArray(s.services).map((x) => ({
      icon: safeString(x?.icon),
      title: safeString(x?.title),
      description: safeString(x?.description),
    })),
    ctaTitle: safeString(s.ctaTitle),
    ctaText: safeString(s.ctaText),
    phones: ensureArray(s.phones).map((p) => ({ label: safeString(p?.label), href: safeString(p?.href) })),
    email: safeString(s.email),
    emailHref: safeString(s.emailHref),
  };
}

function normalizeFounding(section) {
  const s = section || {};
  return {
    subtitle: safeString(s.subtitle),
    imageUrl: safeString(s.imageUrl),
    imageAlt: safeString(s.imageAlt),
    captionHtml: safeString(s.captionHtml),
    dateLabel: safeString(s.dateLabel),
    firstRowTitle: safeString(s.firstRowTitle),
    firstRow: ensureArray(s.firstRow).map((x) => safeString(x)).length ? ensureArray(s.firstRow).map((x) => safeString(x)) : [''],
    secondRowTitle: safeString(s.secondRowTitle),
    secondRow: ensureArray(s.secondRow).map((x) => safeString(x)).length ? ensureArray(s.secondRow).map((x) => safeString(x)) : [''],
    legacyTitle: safeString(s.legacyTitle),
    legacyText: safeString(s.legacyText),
  };
}

function normalizeServicesPreview(section) {
  const s = section || {};
  return {
    title: safeString(s.title),
    subtitle: safeString(s.subtitle),
    services: ensureArray(s.services).map((x) => ({
      icon: safeString(x?.icon),
      color: safeString(x?.color),
      title: safeString(x?.title),
      description: safeString(x?.description),
    })),
  };
}

function normalizeMembersPreview(section) {
  const s = section || {};
  return {
    title: safeString(s.title),
    subtitle: safeString(s.subtitle),
    stats: ensureArray(s.stats).map((x) => ({
      icon: safeString(x?.icon),
      label: safeString(x?.label),
      value: safeString(x?.value),
    })),
  };
}

function normalizeServicesPage(section) {
  const s = section || {};
  return {
    heroTitle: safeString(s.heroTitle),
    heroSubtitle: safeString(s.heroSubtitle),
    services: ensureArray(s.services).map((x) => ({
      icon: safeString(x?.icon),
      color: safeString(x?.color),
      title: safeString(x?.title),
      description: safeString(x?.description),
    })),
    contactTitle: safeString(s.contactTitle),
    contactText: safeString(s.contactText),
    phones: ensureArray(s.phones).map((p) => ({ label: safeString(p?.label), href: safeString(p?.href) })),
    email: safeString(s.email),
    emailHref: safeString(s.emailHref),
    office: safeString(s.office),
  };
}

function normalizeMembersPage(section) {
  const s = section || {};
  return {
    heroTitle: safeString(s.heroTitle),
    heroSubtitle: safeString(s.heroSubtitle),
    membersTabTitle: safeString(s.membersTabTitle),
    membersTabSubtitle: safeString(s.membersTabSubtitle),
    stats: ensureArray(s.stats).map((x) => ({ icon: safeString(x?.icon), label: safeString(x?.label), value: safeString(x?.value) })),
    members: ensureArray(s.members).map((m, idx) => ({
      id: Number(m?.id || idx + 1),
      name: safeString(m?.name),
      designation: safeString(m?.designation),
      phone: safeString(m?.phone),
      email: safeString(m?.email),
      membership_number: safeString(m?.membership_number),
      image: safeString(m?.image),
    })),
    sidePhones: ensureArray(s.sidePhones).map((p) => ({ label: safeString(p?.label), href: safeString(p?.href) })),
    sideEmail: safeString(s.sideEmail),
    sideEmailHref: safeString(s.sideEmailHref),
    sideOffice: safeString(s.sideOffice),
  };
}

function normalizeActivitiesPage(section) {
  const s = section || {};
  return {
    heroTitle: safeString(s.heroTitle),
    heroSubtitle: safeString(s.heroSubtitle),
    sectionTitle: safeString(s.sectionTitle),
    sectionSubtitle: safeString(s.sectionSubtitle),
    activities: ensureArray(s.activities).map((a) => ({
      title: safeString(a?.title),
      date: safeString(a?.date),
      participants: safeString(a?.participants),
      images: ensureArray(a?.images).map((u) => safeString(u)),
      description: safeString(a?.description),
    })),
    ctaTitle: safeString(s.ctaTitle),
    ctaText: safeString(s.ctaText),
    ctaButton: safeString(s.ctaButton),
  };
}

function normalizeDonationPage(section) {
  const s = section || {};
  return {
    heroTitle: safeString(s.heroTitle),
    heroSubtitle: safeString(s.heroSubtitle),
    accountsTitle: safeString(s.accountsTitle),
    accountsSubtitle: safeString(s.accountsSubtitle),
    bank: {
      bankName: safeString(s?.bank?.bankName),
      accountNumber: safeString(s?.bank?.accountNumber),
      accountTitle: safeString(s?.bank?.accountTitle),
    },
    jazzcash: {
      accountNumber: safeString(s?.jazzcash?.accountNumber),
      accountHolder: safeString(s?.jazzcash?.accountHolder),
    },
    formTitle: safeString(s.formTitle),
    formSubtitle: safeString(s.formSubtitle),
    slipHint: safeString(s.slipHint),
  };
}

function normalizeSupportPage(section) {
  const s = section || {};
  return {
    heroTitle: safeString(s.heroTitle),
    heroSubtitle: safeString(s.heroSubtitle),
    title: safeString(s.title),
    subtitle: safeString(s.subtitle),
  };
}

function normalizeAboutPage(section) {
  const s = section || {};
  return {
    heroTitle: safeString(s.heroTitle),
    heroSubtitle: safeString(s.heroSubtitle),
    missionTitle: safeString(s.missionTitle),
    missionText: safeString(s.missionText),
    sopsTitle: safeString(s.sopsTitle),
    sopsSubtitle: safeString(s.sopsSubtitle),
    sops: ensureArray(s.sops).map((x) => ({
      id: safeString(x?.id),
      icon: safeString(x?.icon),
      title: safeString(x?.title),
      description: safeString(x?.description),
      note: safeString(x?.note),
      color: safeString(x?.color),
    })),
    contactTitle: safeString(s.contactTitle),
    phones: ensureArray(s.phones).map((p) => ({ label: safeString(p?.label), href: safeString(p?.href) })),
    email: safeString(s.email),
    emailHref: safeString(s.emailHref),
    officeLine1: safeString(s.officeLine1),
    officeLine2: safeString(s.officeLine2),
    ublAccount: safeString(s.ublAccount),
    ublTitle: safeString(s.ublTitle),
    jazzAccount: safeString(s.jazzAccount),
    jazzHolder: safeString(s.jazzHolder),
    socialTikTok: safeString(s.socialTikTok),
    socialFacebookLabel: safeString(s.socialFacebookLabel),
    socialFacebookHref: safeString(s.socialFacebookHref),
    socialYoutube: safeString(s.socialYoutube),
    socialInstagram: safeString(s.socialInstagram),
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
  const [manifestoForm, setManifestoForm] = useState(() => normalizeManifesto(null));
  const [careForm, setCareForm] = useState(() => normalizeCare(null));
  const [foundingForm, setFoundingForm] = useState(() => normalizeFounding(null));
  const [servicesPreviewForm, setServicesPreviewForm] = useState(() => normalizeServicesPreview(null));
  const [membersPreviewForm, setMembersPreviewForm] = useState(() => normalizeMembersPreview(null));
  const [servicesPageForm, setServicesPageForm] = useState(() => normalizeServicesPage(null));
  const [membersPageForm, setMembersPageForm] = useState(() => normalizeMembersPage(null));
  const [activitiesPageForm, setActivitiesPageForm] = useState(() => normalizeActivitiesPage(null));
  const [donationPageForm, setDonationPageForm] = useState(() => normalizeDonationPage(null));
  const [supportPageForm, setSupportPageForm] = useState(() => normalizeSupportPage(null));
  const [aboutPageForm, setAboutPageForm] = useState(() => normalizeAboutPage(null));

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
    if (selectedKey === 'manifesto') setManifestoForm(normalizeManifesto(value));
    if (selectedKey === 'compassionate_care') setCareForm(normalizeCare(value));
    if (selectedKey === 'founding_members') setFoundingForm(normalizeFounding(value));
    if (selectedKey === 'services_preview') setServicesPreviewForm(normalizeServicesPreview(value));
    if (selectedKey === 'members_preview') setMembersPreviewForm(normalizeMembersPreview(value));
    if (selectedKey === 'services_page') setServicesPageForm(normalizeServicesPage(value));
    if (selectedKey === 'members_page') setMembersPageForm(normalizeMembersPage(value));
    if (selectedKey === 'activities_page') setActivitiesPageForm(normalizeActivitiesPage(value));
    if (selectedKey === 'donation_page') setDonationPageForm(normalizeDonationPage(value));
    if (selectedKey === 'support_page') setSupportPageForm(normalizeSupportPage(value));
    if (selectedKey === 'about_page') setAboutPageForm(normalizeAboutPage(value));
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
    setSaving(true);
    try {
      if (selectedKey === 'hero') {
        await saveSection('hero', heroForm);
      } else if (selectedKey === 'top_donors') {
        await saveSection('top_donors', donorsForm);
      } else if (selectedKey === 'footer') {
        await saveSection('footer', footerForm);
      } else if (selectedKey === 'manifesto') {
        await saveSection('manifesto', manifestoForm);
      } else if (selectedKey === 'compassionate_care') {
        await saveSection('compassionate_care', careForm);
      } else if (selectedKey === 'founding_members') {
        await saveSection('founding_members', foundingForm);
      } else if (selectedKey === 'services_preview') {
        await saveSection('services_preview', servicesPreviewForm);
      } else if (selectedKey === 'members_preview') {
        await saveSection('members_preview', membersPreviewForm);
      } else if (selectedKey === 'services_page') {
        await saveSection('services_page', servicesPageForm);
      } else if (selectedKey === 'members_page') {
        await saveSection('members_page', membersPageForm);
      } else if (selectedKey === 'activities_page') {
        await saveSection('activities_page', activitiesPageForm);
      } else if (selectedKey === 'donation_page') {
        await saveSection('donation_page', donationPageForm);
      } else if (selectedKey === 'support_page') {
        await saveSection('support_page', supportPageForm);
      } else if (selectedKey === 'about_page') {
        await saveSection('about_page', aboutPageForm);
      } else {
        setError('This section is not available in Forms mode yet. Switch to Advanced (JSON) for now.');
        return;
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

              {selectedKey === 'manifesto' ? (
                <div className="kv" style={{ gap: 12 }}>
                  <div className="card" style={{ margin: 0 }}>
                    <div className="card__title">Manifesto</div>
                    <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                      <label className="field">
                        <span className="field__label">Subtitle</span>
                        <input
                          className="input"
                          value={manifestoForm.subtitle}
                          onChange={(e) => setManifestoForm((s) => ({ ...s, subtitle: e.target.value }))}
                        />
                      </label>

                      <div className="card" style={{ margin: 0 }}>
                        <div className="card__title">Paragraphs (HTML allowed)</div>
                        <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                          {manifestoForm.paragraphs.map((p, idx) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <div key={idx} style={{ display: 'grid', gap: 8 }}>
                              <textarea
                                className="input"
                                style={{ minHeight: 120, resize: 'vertical', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
                                value={p.html}
                                onChange={(e) =>
                                  setManifestoForm((s) => ({
                                    ...s,
                                    paragraphs: s.paragraphs.map((x, i) => (i === idx ? { ...x, html: e.target.value } : x)),
                                  }))
                                }
                              />
                              <div style={{ display: 'flex', gap: 10 }}>
                                <button
                                  type="button"
                                  className="btn"
                                  onClick={() => setManifestoForm((s) => ({ ...s, paragraphs: s.paragraphs.filter((_, i) => i !== idx) }))}
                                  disabled={manifestoForm.paragraphs.length <= 1}
                                >
                                  Remove paragraph
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn"
                            onClick={() => setManifestoForm((s) => ({ ...s, paragraphs: [...s.paragraphs, { html: '' }] }))}
                          >
                            Add paragraph
                          </button>
                        </div>
                      </div>

                      <div className="card" style={{ margin: 0 }}>
                        <div className="card__title">Stats</div>
                        <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                          {manifestoForm.stats.map((st, idx) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                              <label className="field">
                                <span className="field__label">Icon (Lucide name)</span>
                                <input
                                  className="input"
                                  value={st.icon}
                                  onChange={(e) =>
                                    setManifestoForm((s) => ({
                                      ...s,
                                      stats: s.stats.map((x, i) => (i === idx ? { ...x, icon: e.target.value } : x)),
                                    }))
                                  }
                                />
                              </label>
                              <label className="field">
                                <span className="field__label">Tone (css)</span>
                                <input
                                  className="input"
                                  value={st.tone}
                                  onChange={(e) =>
                                    setManifestoForm((s) => ({
                                      ...s,
                                      stats: s.stats.map((x, i) => (i === idx ? { ...x, tone: e.target.value } : x)),
                                    }))
                                  }
                                />
                              </label>
                              <label className="field">
                                <span className="field__label">Title</span>
                                <input
                                  className="input"
                                  value={st.title}
                                  onChange={(e) =>
                                    setManifestoForm((s) => ({
                                      ...s,
                                      stats: s.stats.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)),
                                    }))
                                  }
                                />
                              </label>
                              <label className="field">
                                <span className="field__label">Text</span>
                                <input
                                  className="input"
                                  value={st.text}
                                  onChange={(e) =>
                                    setManifestoForm((s) => ({
                                      ...s,
                                      stats: s.stats.map((x, i) => (i === idx ? { ...x, text: e.target.value } : x)),
                                    }))
                                  }
                                />
                              </label>
                              <div style={{ gridColumn: '1 / -1' }}>
                                <button
                                  type="button"
                                  className="btn"
                                  onClick={() => setManifestoForm((s) => ({ ...s, stats: s.stats.filter((_, i) => i !== idx) }))}
                                  disabled={manifestoForm.stats.length <= 1}
                                >
                                  Remove stat
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn"
                            onClick={() =>
                              setManifestoForm((s) => ({
                                ...s,
                                stats: [...s.stats, { icon: 'Shield', tone: 'blue', title: '', text: '' }],
                              }))
                            }
                          >
                            Add stat
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedKey === 'compassionate_care' ? (
                <div className="kv" style={{ gap: 12 }}>
                  <div className="card" style={{ margin: 0 }}>
                    <div className="card__title">Compassionate care</div>
                    <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label className="field">
                          <span className="field__label">Eyebrow</span>
                          <input className="input" value={careForm.eyebrow} onChange={(e) => setCareForm((s) => ({ ...s, eyebrow: e.target.value }))} />
                        </label>
                        <label className="field">
                          <span className="field__label">Title</span>
                          <input className="input" value={careForm.title} onChange={(e) => setCareForm((s) => ({ ...s, title: e.target.value }))} />
                        </label>
                      </div>
                      <label className="field">
                        <span className="field__label">Title accent</span>
                        <input className="input" value={careForm.titleAccent} onChange={(e) => setCareForm((s) => ({ ...s, titleAccent: e.target.value }))} />
                      </label>
                      <label className="field">
                        <span className="field__label">Lead</span>
                        <textarea className="input" style={{ minHeight: 90, resize: 'vertical' }} value={careForm.lede} onChange={(e) => setCareForm((s) => ({ ...s, lede: e.target.value }))} />
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label className="field">
                          <span className="field__label">Subtitle prefix</span>
                          <input className="input" value={careForm.subtitlePrefix} onChange={(e) => setCareForm((s) => ({ ...s, subtitlePrefix: e.target.value }))} />
                        </label>
                        <label className="field">
                          <span className="field__label">Subtitle highlight</span>
                          <input className="input" value={careForm.subtitleHighlight} onChange={(e) => setCareForm((s) => ({ ...s, subtitleHighlight: e.target.value }))} />
                        </label>
                      </div>

                      <div className="card" style={{ margin: 0 }}>
                        <div className="card__title">Services</div>
                        <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                          {careForm.services.map((sv, idx) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                              <label className="field">
                                <span className="field__label">Icon</span>
                                <input className="input" value={sv.icon} onChange={(e) => setCareForm((s) => ({ ...s, services: s.services.map((x, i) => (i === idx ? { ...x, icon: e.target.value } : x)) }))} />
                              </label>
                              <label className="field">
                                <span className="field__label">Title</span>
                                <input className="input" value={sv.title} onChange={(e) => setCareForm((s) => ({ ...s, services: s.services.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)) }))} />
                              </label>
                              <div style={{ gridColumn: '1 / -1' }}>
                                <label className="field">
                                  <span className="field__label">Description</span>
                                  <input className="input" value={sv.description} onChange={(e) => setCareForm((s) => ({ ...s, services: s.services.map((x, i) => (i === idx ? { ...x, description: e.target.value } : x)) }))} />
                                </label>
                              </div>
                              <div style={{ gridColumn: '1 / -1' }}>
                                <button type="button" className="btn" onClick={() => setCareForm((s) => ({ ...s, services: s.services.filter((_, i) => i !== idx) }))}>
                                  Remove service
                                </button>
                              </div>
                            </div>
                          ))}
                          <button type="button" className="btn" onClick={() => setCareForm((s) => ({ ...s, services: [...s.services, { icon: 'Shield', title: '', description: '' }] }))}>
                            Add service
                          </button>
                        </div>
                      </div>

                      <div className="card" style={{ margin: 0 }}>
                        <div className="card__title">CTA</div>
                        <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                          <label className="field">
                            <span className="field__label">CTA title</span>
                            <input className="input" value={careForm.ctaTitle} onChange={(e) => setCareForm((s) => ({ ...s, ctaTitle: e.target.value }))} />
                          </label>
                          <label className="field">
                            <span className="field__label">CTA text</span>
                            <textarea className="input" style={{ minHeight: 90, resize: 'vertical' }} value={careForm.ctaText} onChange={(e) => setCareForm((s) => ({ ...s, ctaText: e.target.value }))} />
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <label className="field">
                              <span className="field__label">Email</span>
                              <input className="input" value={careForm.email} onChange={(e) => setCareForm((s) => ({ ...s, email: e.target.value }))} />
                            </label>
                            <label className="field">
                              <span className="field__label">Email link</span>
                              <input className="input" value={careForm.emailHref} onChange={(e) => setCareForm((s) => ({ ...s, emailHref: e.target.value }))} />
                            </label>
                          </div>
                          <div className="card" style={{ margin: 0 }}>
                            <div className="card__title">Phones</div>
                            <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                              {careForm.phones.map((p, idx) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                                  <label className="field">
                                    <span className="field__label">Label</span>
                                    <input className="input" value={p.label} onChange={(e) => setCareForm((s) => ({ ...s, phones: s.phones.map((x, i) => (i === idx ? { ...x, label: e.target.value } : x)) }))} />
                                  </label>
                                  <label className="field">
                                    <span className="field__label">tel:</span>
                                    <input className="input" value={p.href} onChange={(e) => setCareForm((s) => ({ ...s, phones: s.phones.map((x, i) => (i === idx ? { ...x, href: e.target.value } : x)) }))} />
                                  </label>
                                  <button type="button" className="btn" onClick={() => setCareForm((s) => ({ ...s, phones: s.phones.filter((_, i) => i !== idx) }))} disabled={careForm.phones.length <= 1}>
                                    Remove
                                  </button>
                                </div>
                              ))}
                              <button type="button" className="btn" onClick={() => setCareForm((s) => ({ ...s, phones: [...s.phones, { label: '', href: '' }] }))}>
                                Add phone
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
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

              {selectedKey === 'founding_members' ? (
                <div className="card" style={{ margin: 0 }}>
                  <div className="card__title">Founding members</div>
                  <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                    <label className="field">
                      <span className="field__label">Subtitle</span>
                      <input className="input" value={foundingForm.subtitle} onChange={(e) => setFoundingForm((s) => ({ ...s, subtitle: e.target.value }))} />
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <label className="field">
                        <span className="field__label">Image URL (optional)</span>
                        <input className="input" value={foundingForm.imageUrl} onChange={(e) => setFoundingForm((s) => ({ ...s, imageUrl: e.target.value }))} />
                      </label>
                      <label className="field">
                        <span className="field__label">Image alt</span>
                        <input className="input" value={foundingForm.imageAlt} onChange={(e) => setFoundingForm((s) => ({ ...s, imageAlt: e.target.value }))} />
                      </label>
                    </div>
                    <label className="field">
                      <span className="field__label">Caption (HTML allowed)</span>
                      <textarea className="input" style={{ minHeight: 90, resize: 'vertical', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }} value={foundingForm.captionHtml} onChange={(e) => setFoundingForm((s) => ({ ...s, captionHtml: e.target.value }))} />
                    </label>
                    <label className="field">
                      <span className="field__label">Date label</span>
                      <input className="input" value={foundingForm.dateLabel} onChange={(e) => setFoundingForm((s) => ({ ...s, dateLabel: e.target.value }))} />
                    </label>

                    <div className="card" style={{ margin: 0 }}>
                      <div className="card__title">First row</div>
                      <div className="card__body" style={{ display: 'grid', gap: 10 }}>
                        <label className="field">
                          <span className="field__label">Row title</span>
                          <input className="input" value={foundingForm.firstRowTitle} onChange={(e) => setFoundingForm((s) => ({ ...s, firstRowTitle: e.target.value }))} />
                        </label>
                        {foundingForm.firstRow.map((name, idx) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
                            <input className="input" value={name} onChange={(e) => setFoundingForm((s) => ({ ...s, firstRow: s.firstRow.map((x, i) => (i === idx ? e.target.value : x)) }))} />
                            <button type="button" className="btn" onClick={() => setFoundingForm((s) => ({ ...s, firstRow: s.firstRow.filter((_, i) => i !== idx) }))} disabled={foundingForm.firstRow.length <= 1}>
                              Remove
                            </button>
                          </div>
                        ))}
                        <button type="button" className="btn" onClick={() => setFoundingForm((s) => ({ ...s, firstRow: [...s.firstRow, ''] }))}>
                          Add name
                        </button>
                      </div>
                    </div>

                    <div className="card" style={{ margin: 0 }}>
                      <div className="card__title">Second row</div>
                      <div className="card__body" style={{ display: 'grid', gap: 10 }}>
                        <label className="field">
                          <span className="field__label">Row title</span>
                          <input className="input" value={foundingForm.secondRowTitle} onChange={(e) => setFoundingForm((s) => ({ ...s, secondRowTitle: e.target.value }))} />
                        </label>
                        {foundingForm.secondRow.map((name, idx) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
                            <input className="input" value={name} onChange={(e) => setFoundingForm((s) => ({ ...s, secondRow: s.secondRow.map((x, i) => (i === idx ? e.target.value : x)) }))} />
                            <button type="button" className="btn" onClick={() => setFoundingForm((s) => ({ ...s, secondRow: s.secondRow.filter((_, i) => i !== idx) }))} disabled={foundingForm.secondRow.length <= 1}>
                              Remove
                            </button>
                          </div>
                        ))}
                        <button type="button" className="btn" onClick={() => setFoundingForm((s) => ({ ...s, secondRow: [...s.secondRow, ''] }))}>
                          Add name
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <label className="field">
                        <span className="field__label">Legacy title</span>
                        <input className="input" value={foundingForm.legacyTitle} onChange={(e) => setFoundingForm((s) => ({ ...s, legacyTitle: e.target.value }))} />
                      </label>
                      <label className="field">
                        <span className="field__label">Legacy text</span>
                        <input className="input" value={foundingForm.legacyText} onChange={(e) => setFoundingForm((s) => ({ ...s, legacyText: e.target.value }))} />
                      </label>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedKey === 'services_preview' ? (
                <div className="card" style={{ margin: 0 }}>
                  <div className="card__title">Services preview</div>
                  <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <label className="field">
                        <span className="field__label">Title</span>
                        <input className="input" value={servicesPreviewForm.title} onChange={(e) => setServicesPreviewForm((s) => ({ ...s, title: e.target.value }))} />
                      </label>
                      <label className="field">
                        <span className="field__label">Subtitle</span>
                        <input className="input" value={servicesPreviewForm.subtitle} onChange={(e) => setServicesPreviewForm((s) => ({ ...s, subtitle: e.target.value }))} />
                      </label>
                    </div>
                    <div className="card" style={{ margin: 0 }}>
                      <div className="card__title">Cards</div>
                      <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                        {servicesPreviewForm.services.map((sv, idx) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <label className="field">
                              <span className="field__label">Icon</span>
                              <input className="input" value={sv.icon} onChange={(e) => setServicesPreviewForm((s) => ({ ...s, services: s.services.map((x, i) => (i === idx ? { ...x, icon: e.target.value } : x)) }))} />
                            </label>
                            <label className="field">
                              <span className="field__label">Color</span>
                              <input className="input" value={sv.color} onChange={(e) => setServicesPreviewForm((s) => ({ ...s, services: s.services.map((x, i) => (i === idx ? { ...x, color: e.target.value } : x)) }))} />
                            </label>
                            <label className="field">
                              <span className="field__label">Title</span>
                              <input className="input" value={sv.title} onChange={(e) => setServicesPreviewForm((s) => ({ ...s, services: s.services.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)) }))} />
                            </label>
                            <label className="field">
                              <span className="field__label">Description</span>
                              <input className="input" value={sv.description} onChange={(e) => setServicesPreviewForm((s) => ({ ...s, services: s.services.map((x, i) => (i === idx ? { ...x, description: e.target.value } : x)) }))} />
                            </label>
                            <div style={{ gridColumn: '1 / -1' }}>
                              <button type="button" className="btn" onClick={() => setServicesPreviewForm((s) => ({ ...s, services: s.services.filter((_, i) => i !== idx) }))}>
                                Remove card
                              </button>
                            </div>
                          </div>
                        ))}
                        <button type="button" className="btn" onClick={() => setServicesPreviewForm((s) => ({ ...s, services: [...s.services, { icon: 'Shield', color: 'blue', title: '', description: '' }] }))}>
                          Add card
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedKey === 'members_preview' ? (
                <div className="card" style={{ margin: 0 }}>
                  <div className="card__title">Members preview</div>
                  <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <label className="field">
                        <span className="field__label">Title</span>
                        <input className="input" value={membersPreviewForm.title} onChange={(e) => setMembersPreviewForm((s) => ({ ...s, title: e.target.value }))} />
                      </label>
                      <label className="field">
                        <span className="field__label">Subtitle</span>
                        <input className="input" value={membersPreviewForm.subtitle} onChange={(e) => setMembersPreviewForm((s) => ({ ...s, subtitle: e.target.value }))} />
                      </label>
                    </div>
                    <div className="card" style={{ margin: 0 }}>
                      <div className="card__title">Stats</div>
                      <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                        {membersPreviewForm.stats.map((st, idx) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                            <label className="field">
                              <span className="field__label">Icon</span>
                              <input className="input" value={st.icon} onChange={(e) => setMembersPreviewForm((s) => ({ ...s, stats: s.stats.map((x, i) => (i === idx ? { ...x, icon: e.target.value } : x)) }))} />
                            </label>
                            <label className="field">
                              <span className="field__label">Label</span>
                              <input className="input" value={st.label} onChange={(e) => setMembersPreviewForm((s) => ({ ...s, stats: s.stats.map((x, i) => (i === idx ? { ...x, label: e.target.value } : x)) }))} />
                            </label>
                            <label className="field">
                              <span className="field__label">Value</span>
                              <input className="input" value={st.value} onChange={(e) => setMembersPreviewForm((s) => ({ ...s, stats: s.stats.map((x, i) => (i === idx ? { ...x, value: e.target.value } : x)) }))} />
                            </label>
                            <button type="button" className="btn" onClick={() => setMembersPreviewForm((s) => ({ ...s, stats: s.stats.filter((_, i) => i !== idx) }))} disabled={membersPreviewForm.stats.length <= 1}>
                              Remove
                            </button>
                          </div>
                        ))}
                        <button type="button" className="btn" onClick={() => setMembersPreviewForm((s) => ({ ...s, stats: [...s.stats, { icon: 'Users', label: '', value: '' }] }))}>
                          Add stat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedKey === 'services_page' ? (
                <div className="card" style={{ margin: 0 }}>
                  <div className="card__title">Services page</div>
                  <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                    <label className="field">
                      <span className="field__label">Hero title</span>
                      <input className="input" value={servicesPageForm.heroTitle} onChange={(e) => setServicesPageForm((s) => ({ ...s, heroTitle: e.target.value }))} />
                    </label>
                    <label className="field">
                      <span className="field__label">Hero subtitle</span>
                      <textarea className="input" style={{ minHeight: 90, resize: 'vertical' }} value={servicesPageForm.heroSubtitle} onChange={(e) => setServicesPageForm((s) => ({ ...s, heroSubtitle: e.target.value }))} />
                    </label>
                    <div className="card" style={{ margin: 0 }}>
                      <div className="card__title">Services</div>
                      <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                        {servicesPageForm.services.map((sv, idx) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <label className="field">
                              <span className="field__label">Icon</span>
                              <input className="input" value={sv.icon} onChange={(e) => setServicesPageForm((s) => ({ ...s, services: s.services.map((x, i) => (i === idx ? { ...x, icon: e.target.value } : x)) }))} />
                            </label>
                            <label className="field">
                              <span className="field__label">Color</span>
                              <input className="input" value={sv.color} onChange={(e) => setServicesPageForm((s) => ({ ...s, services: s.services.map((x, i) => (i === idx ? { ...x, color: e.target.value } : x)) }))} />
                            </label>
                            <label className="field">
                              <span className="field__label">Title</span>
                              <input className="input" value={sv.title} onChange={(e) => setServicesPageForm((s) => ({ ...s, services: s.services.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)) }))} />
                            </label>
                            <label className="field">
                              <span className="field__label">Description</span>
                              <input className="input" value={sv.description} onChange={(e) => setServicesPageForm((s) => ({ ...s, services: s.services.map((x, i) => (i === idx ? { ...x, description: e.target.value } : x)) }))} />
                            </label>
                            <div style={{ gridColumn: '1 / -1' }}>
                              <button type="button" className="btn" onClick={() => setServicesPageForm((s) => ({ ...s, services: s.services.filter((_, i) => i !== idx) }))}>
                                Remove service
                              </button>
                            </div>
                          </div>
                        ))}
                        <button type="button" className="btn" onClick={() => setServicesPageForm((s) => ({ ...s, services: [...s.services, { icon: 'Shield', color: 'blue', title: '', description: '' }] }))}>
                          Add service
                        </button>
                      </div>
                    </div>

                    <div className="card" style={{ margin: 0 }}>
                      <div className="card__title">Contact block</div>
                      <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                        <label className="field">
                          <span className="field__label">Contact title</span>
                          <input className="input" value={servicesPageForm.contactTitle} onChange={(e) => setServicesPageForm((s) => ({ ...s, contactTitle: e.target.value }))} />
                        </label>
                        <label className="field">
                          <span className="field__label">Contact text</span>
                          <textarea className="input" style={{ minHeight: 90, resize: 'vertical' }} value={servicesPageForm.contactText} onChange={(e) => setServicesPageForm((s) => ({ ...s, contactText: e.target.value }))} />
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <label className="field">
                            <span className="field__label">Email</span>
                            <input className="input" value={servicesPageForm.email} onChange={(e) => setServicesPageForm((s) => ({ ...s, email: e.target.value }))} />
                          </label>
                          <label className="field">
                            <span className="field__label">Email link</span>
                            <input className="input" value={servicesPageForm.emailHref} onChange={(e) => setServicesPageForm((s) => ({ ...s, emailHref: e.target.value }))} />
                          </label>
                        </div>
                        <label className="field">
                          <span className="field__label">Office</span>
                          <input className="input" value={servicesPageForm.office} onChange={(e) => setServicesPageForm((s) => ({ ...s, office: e.target.value }))} />
                        </label>
                        <div className="card" style={{ margin: 0 }}>
                          <div className="card__title">Phones</div>
                          <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                            {servicesPageForm.phones.map((p, idx) => (
                              // eslint-disable-next-line react/no-array-index-key
                              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                                <label className="field">
                                  <span className="field__label">Label</span>
                                  <input className="input" value={p.label} onChange={(e) => setServicesPageForm((s) => ({ ...s, phones: s.phones.map((x, i) => (i === idx ? { ...x, label: e.target.value } : x)) }))} />
                                </label>
                                <label className="field">
                                  <span className="field__label">tel:</span>
                                  <input className="input" value={p.href} onChange={(e) => setServicesPageForm((s) => ({ ...s, phones: s.phones.map((x, i) => (i === idx ? { ...x, href: e.target.value } : x)) }))} />
                                </label>
                                <button type="button" className="btn" onClick={() => setServicesPageForm((s) => ({ ...s, phones: s.phones.filter((_, i) => i !== idx) }))} disabled={servicesPageForm.phones.length <= 1}>
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button type="button" className="btn" onClick={() => setServicesPageForm((s) => ({ ...s, phones: [...s.phones, { label: '', href: '' }] }))}>
                              Add phone
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedKey === 'members_page' ? (
                <div className="card" style={{ margin: 0 }}>
                  <div className="card__title">Members page</div>
                  <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <label className="field">
                        <span className="field__label">Hero title</span>
                        <input className="input" value={membersPageForm.heroTitle} onChange={(e) => setMembersPageForm((s) => ({ ...s, heroTitle: e.target.value }))} />
                      </label>
                      <label className="field">
                        <span className="field__label">Hero subtitle</span>
                        <input className="input" value={membersPageForm.heroSubtitle} onChange={(e) => setMembersPageForm((s) => ({ ...s, heroSubtitle: e.target.value }))} />
                      </label>
                    </div>

                    <div className="card" style={{ margin: 0 }}>
                      <div className="card__title">Stats</div>
                      <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                        {membersPageForm.stats.map((st, idx) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                            <label className="field">
                              <span className="field__label">Icon</span>
                              <input className="input" value={st.icon} onChange={(e) => setMembersPageForm((s) => ({ ...s, stats: s.stats.map((x, i) => (i === idx ? { ...x, icon: e.target.value } : x)) }))} />
                            </label>
                            <label className="field">
                              <span className="field__label">Label</span>
                              <input className="input" value={st.label} onChange={(e) => setMembersPageForm((s) => ({ ...s, stats: s.stats.map((x, i) => (i === idx ? { ...x, label: e.target.value } : x)) }))} />
                            </label>
                            <label className="field">
                              <span className="field__label">Value</span>
                              <input className="input" value={st.value} onChange={(e) => setMembersPageForm((s) => ({ ...s, stats: s.stats.map((x, i) => (i === idx ? { ...x, value: e.target.value } : x)) }))} />
                            </label>
                            <button type="button" className="btn" onClick={() => setMembersPageForm((s) => ({ ...s, stats: s.stats.filter((_, i) => i !== idx) }))} disabled={membersPageForm.stats.length <= 1}>
                              Remove
                            </button>
                          </div>
                        ))}
                        <button type="button" className="btn" onClick={() => setMembersPageForm((s) => ({ ...s, stats: [...s.stats, { icon: 'Users', label: '', value: '' }] }))}>
                          Add stat
                        </button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <label className="field">
                        <span className="field__label">Members tab title</span>
                        <input className="input" value={membersPageForm.membersTabTitle} onChange={(e) => setMembersPageForm((s) => ({ ...s, membersTabTitle: e.target.value }))} />
                      </label>
                      <label className="field">
                        <span className="field__label">Members tab subtitle</span>
                        <input className="input" value={membersPageForm.membersTabSubtitle} onChange={(e) => setMembersPageForm((s) => ({ ...s, membersTabSubtitle: e.target.value }))} />
                      </label>
                    </div>

                    <div className="card" style={{ margin: 0 }}>
                      <div className="card__title">Members list</div>
                      <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                        {membersPageForm.members.map((m, idx) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <div key={idx} className="card" style={{ margin: 0 }}>
                            <div className="card__title">Member #{idx + 1}</div>
                            <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <label className="field">
                                  <span className="field__label">Name</span>
                                  <input className="input" value={m.name} onChange={(e) => setMembersPageForm((s) => ({ ...s, members: s.members.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)) }))} />
                                </label>
                                <label className="field">
                                  <span className="field__label">Designation</span>
                                  <input className="input" value={m.designation} onChange={(e) => setMembersPageForm((s) => ({ ...s, members: s.members.map((x, i) => (i === idx ? { ...x, designation: e.target.value } : x)) }))} />
                                </label>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <label className="field">
                                  <span className="field__label">Phone</span>
                                  <input className="input" value={m.phone} onChange={(e) => setMembersPageForm((s) => ({ ...s, members: s.members.map((x, i) => (i === idx ? { ...x, phone: e.target.value } : x)) }))} />
                                </label>
                                <label className="field">
                                  <span className="field__label">Email</span>
                                  <input className="input" value={m.email} onChange={(e) => setMembersPageForm((s) => ({ ...s, members: s.members.map((x, i) => (i === idx ? { ...x, email: e.target.value } : x)) }))} />
                                </label>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <label className="field">
                                  <span className="field__label">Membership #</span>
                                  <input className="input" value={m.membership_number} onChange={(e) => setMembersPageForm((s) => ({ ...s, members: s.members.map((x, i) => (i === idx ? { ...x, membership_number: e.target.value } : x)) }))} />
                                </label>
                                <label className="field">
                                  <span className="field__label">Image URL</span>
                                  <input className="input" value={m.image} onChange={(e) => setMembersPageForm((s) => ({ ...s, members: s.members.map((x, i) => (i === idx ? { ...x, image: e.target.value } : x)) }))} />
                                </label>
                              </div>
                              <button type="button" className="btn" onClick={() => setMembersPageForm((s) => ({ ...s, members: s.members.filter((_, i) => i !== idx) }))} disabled={membersPageForm.members.length <= 1}>
                                Remove member
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn"
                          onClick={() =>
                            setMembersPageForm((s) => ({
                              ...s,
                              members: [
                                ...s.members,
                                { id: s.members.length + 1, name: '', designation: '', phone: '', email: '', membership_number: '', image: '' },
                              ],
                            }))
                          }
                        >
                          Add member
                        </button>
                      </div>
                    </div>

                    <div className="card" style={{ margin: 0 }}>
                      <div className="card__title">Sidebar contact</div>
                      <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                        <label className="field">
                          <span className="field__label">Office</span>
                          <input className="input" value={membersPageForm.sideOffice} onChange={(e) => setMembersPageForm((s) => ({ ...s, sideOffice: e.target.value }))} />
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <label className="field">
                            <span className="field__label">Email</span>
                            <input className="input" value={membersPageForm.sideEmail} onChange={(e) => setMembersPageForm((s) => ({ ...s, sideEmail: e.target.value }))} />
                          </label>
                          <label className="field">
                            <span className="field__label">Email link</span>
                            <input className="input" value={membersPageForm.sideEmailHref} onChange={(e) => setMembersPageForm((s) => ({ ...s, sideEmailHref: e.target.value }))} />
                          </label>
                        </div>
                        <div className="card" style={{ margin: 0 }}>
                          <div className="card__title">Phones</div>
                          <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                            {membersPageForm.sidePhones.map((p, idx) => (
                              // eslint-disable-next-line react/no-array-index-key
                              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                                <label className="field">
                                  <span className="field__label">Label</span>
                                  <input className="input" value={p.label} onChange={(e) => setMembersPageForm((s) => ({ ...s, sidePhones: s.sidePhones.map((x, i) => (i === idx ? { ...x, label: e.target.value } : x)) }))} />
                                </label>
                                <label className="field">
                                  <span className="field__label">tel:</span>
                                  <input className="input" value={p.href} onChange={(e) => setMembersPageForm((s) => ({ ...s, sidePhones: s.sidePhones.map((x, i) => (i === idx ? { ...x, href: e.target.value } : x)) }))} />
                                </label>
                                <button type="button" className="btn" onClick={() => setMembersPageForm((s) => ({ ...s, sidePhones: s.sidePhones.filter((_, i) => i !== idx) }))} disabled={membersPageForm.sidePhones.length <= 1}>
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button type="button" className="btn" onClick={() => setMembersPageForm((s) => ({ ...s, sidePhones: [...s.sidePhones, { label: '', href: '' }] }))}>
                              Add phone
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedKey === 'activities_page' ? (
                <div className="card" style={{ margin: 0 }}>
                  <div className="card__title">Activities page</div>
                  <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <label className="field">
                        <span className="field__label">Hero title</span>
                        <input className="input" value={activitiesPageForm.heroTitle} onChange={(e) => setActivitiesPageForm((s) => ({ ...s, heroTitle: e.target.value }))} />
                      </label>
                      <label className="field">
                        <span className="field__label">Hero subtitle</span>
                        <input className="input" value={activitiesPageForm.heroSubtitle} onChange={(e) => setActivitiesPageForm((s) => ({ ...s, heroSubtitle: e.target.value }))} />
                      </label>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <label className="field">
                        <span className="field__label">Section title</span>
                        <input className="input" value={activitiesPageForm.sectionTitle} onChange={(e) => setActivitiesPageForm((s) => ({ ...s, sectionTitle: e.target.value }))} />
                      </label>
                      <label className="field">
                        <span className="field__label">Section subtitle</span>
                        <input className="input" value={activitiesPageForm.sectionSubtitle} onChange={(e) => setActivitiesPageForm((s) => ({ ...s, sectionSubtitle: e.target.value }))} />
                      </label>
                    </div>

                    <div className="card" style={{ margin: 0 }}>
                      <div className="card__title">Activities</div>
                      <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                        {activitiesPageForm.activities.map((a, idx) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <div key={idx} className="card" style={{ margin: 0 }}>
                            <div className="card__title">Activity #{idx + 1}</div>
                            <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                                <label className="field">
                                  <span className="field__label">Title</span>
                                  <input className="input" value={a.title} onChange={(e) => setActivitiesPageForm((s) => ({ ...s, activities: s.activities.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)) }))} />
                                </label>
                                <label className="field">
                                  <span className="field__label">Date (YYYY-MM-DD)</span>
                                  <input className="input" value={a.date} onChange={(e) => setActivitiesPageForm((s) => ({ ...s, activities: s.activities.map((x, i) => (i === idx ? { ...x, date: e.target.value } : x)) }))} />
                                </label>
                                <label className="field">
                                  <span className="field__label">Participants</span>
                                  <input className="input" value={a.participants} onChange={(e) => setActivitiesPageForm((s) => ({ ...s, activities: s.activities.map((x, i) => (i === idx ? { ...x, participants: e.target.value } : x)) }))} />
                                </label>
                              </div>
                              <label className="field">
                                <span className="field__label">Description</span>
                                <input className="input" value={a.description} onChange={(e) => setActivitiesPageForm((s) => ({ ...s, activities: s.activities.map((x, i) => (i === idx ? { ...x, description: e.target.value } : x)) }))} />
                              </label>
                              <div className="card" style={{ margin: 0 }}>
                                <div className="card__title">Images (URLs)</div>
                                <div className="card__body" style={{ display: 'grid', gap: 10 }}>
                                  {a.images.map((u, imgIdx) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <div key={imgIdx} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
                                      <input
                                        className="input"
                                        value={u}
                                        onChange={(e) =>
                                          setActivitiesPageForm((s) => ({
                                            ...s,
                                            activities: s.activities.map((x, i) =>
                                              i === idx
                                                ? { ...x, images: x.images.map((z, j) => (j === imgIdx ? e.target.value : z)) }
                                                : x
                                            ),
                                          }))
                                        }
                                      />
                                      <button
                                        type="button"
                                        className="btn"
                                        onClick={() =>
                                          setActivitiesPageForm((s) => ({
                                            ...s,
                                            activities: s.activities.map((x, i) =>
                                              i === idx ? { ...x, images: x.images.filter((_, j) => j !== imgIdx) } : x
                                            ),
                                          }))
                                        }
                                        disabled={a.images.length <= 1}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    className="btn"
                                    onClick={() =>
                                      setActivitiesPageForm((s) => ({
                                        ...s,
                                        activities: s.activities.map((x, i) =>
                                          i === idx ? { ...x, images: [...x.images, ''] } : x
                                        ),
                                      }))
                                    }
                                  >
                                    Add image
                                  </button>
                                </div>
                              </div>
                              <button type="button" className="btn" onClick={() => setActivitiesPageForm((s) => ({ ...s, activities: s.activities.filter((_, i) => i !== idx) }))} disabled={activitiesPageForm.activities.length <= 1}>
                                Remove activity
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn"
                          onClick={() =>
                            setActivitiesPageForm((s) => ({
                              ...s,
                              activities: [...s.activities, { title: '', date: '', participants: '', images: [''], description: '' }],
                            }))
                          }
                        >
                          Add activity
                        </button>
                      </div>
                    </div>

                    <div className="card" style={{ margin: 0 }}>
                      <div className="card__title">CTA</div>
                      <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                          <label className="field">
                            <span className="field__label">CTA title</span>
                            <input className="input" value={activitiesPageForm.ctaTitle} onChange={(e) => setActivitiesPageForm((s) => ({ ...s, ctaTitle: e.target.value }))} />
                          </label>
                          <label className="field">
                            <span className="field__label">CTA text</span>
                            <input className="input" value={activitiesPageForm.ctaText} onChange={(e) => setActivitiesPageForm((s) => ({ ...s, ctaText: e.target.value }))} />
                          </label>
                          <label className="field">
                            <span className="field__label">CTA button</span>
                            <input className="input" value={activitiesPageForm.ctaButton} onChange={(e) => setActivitiesPageForm((s) => ({ ...s, ctaButton: e.target.value }))} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedKey === 'donation_page' ? (
                <div className="card" style={{ margin: 0 }}>
                  <div className="card__title">Donation page</div>
                  <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                    <label className="field">
                      <span className="field__label">Hero title</span>
                      <input className="input" value={donationPageForm.heroTitle} onChange={(e) => setDonationPageForm((s) => ({ ...s, heroTitle: e.target.value }))} />
                    </label>
                    <label className="field">
                      <span className="field__label">Hero subtitle</span>
                      <textarea className="input" style={{ minHeight: 90, resize: 'vertical' }} value={donationPageForm.heroSubtitle} onChange={(e) => setDonationPageForm((s) => ({ ...s, heroSubtitle: e.target.value }))} />
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <label className="field">
                        <span className="field__label">Accounts title</span>
                        <input className="input" value={donationPageForm.accountsTitle} onChange={(e) => setDonationPageForm((s) => ({ ...s, accountsTitle: e.target.value }))} />
                      </label>
                      <label className="field">
                        <span className="field__label">Accounts subtitle</span>
                        <input className="input" value={donationPageForm.accountsSubtitle} onChange={(e) => setDonationPageForm((s) => ({ ...s, accountsSubtitle: e.target.value }))} />
                      </label>
                    </div>

                    <div className="card" style={{ margin: 0 }}>
                      <div className="card__title">Bank account</div>
                      <div className="card__body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                        <label className="field">
                          <span className="field__label">Bank name</span>
                          <input className="input" value={donationPageForm.bank.bankName} onChange={(e) => setDonationPageForm((s) => ({ ...s, bank: { ...s.bank, bankName: e.target.value } }))} />
                        </label>
                        <label className="field">
                          <span className="field__label">Account number</span>
                          <input className="input" value={donationPageForm.bank.accountNumber} onChange={(e) => setDonationPageForm((s) => ({ ...s, bank: { ...s.bank, accountNumber: e.target.value } }))} />
                        </label>
                        <label className="field">
                          <span className="field__label">Account title</span>
                          <input className="input" value={donationPageForm.bank.accountTitle} onChange={(e) => setDonationPageForm((s) => ({ ...s, bank: { ...s.bank, accountTitle: e.target.value } }))} />
                        </label>
                      </div>
                    </div>

                    <div className="card" style={{ margin: 0 }}>
                      <div className="card__title">JazzCash</div>
                      <div className="card__body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label className="field">
                          <span className="field__label">Account number</span>
                          <input className="input" value={donationPageForm.jazzcash.accountNumber} onChange={(e) => setDonationPageForm((s) => ({ ...s, jazzcash: { ...s.jazzcash, accountNumber: e.target.value } }))} />
                        </label>
                        <label className="field">
                          <span className="field__label">Account holder</span>
                          <input className="input" value={donationPageForm.jazzcash.accountHolder} onChange={(e) => setDonationPageForm((s) => ({ ...s, jazzcash: { ...s.jazzcash, accountHolder: e.target.value } }))} />
                        </label>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <label className="field">
                        <span className="field__label">Form title</span>
                        <input className="input" value={donationPageForm.formTitle} onChange={(e) => setDonationPageForm((s) => ({ ...s, formTitle: e.target.value }))} />
                      </label>
                      <label className="field">
                        <span className="field__label">Form subtitle</span>
                        <input className="input" value={donationPageForm.formSubtitle} onChange={(e) => setDonationPageForm((s) => ({ ...s, formSubtitle: e.target.value }))} />
                      </label>
                    </div>
                    <label className="field">
                      <span className="field__label">Slip hint</span>
                      <input className="input" value={donationPageForm.slipHint} onChange={(e) => setDonationPageForm((s) => ({ ...s, slipHint: e.target.value }))} />
                    </label>
                  </div>
                </div>
              ) : null}

              {selectedKey === 'support_page' ? (
                <div className="card" style={{ margin: 0 }}>
                  <div className="card__title">Support request page</div>
                  <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <label className="field">
                        <span className="field__label">Hero title</span>
                        <input className="input" value={supportPageForm.heroTitle} onChange={(e) => setSupportPageForm((s) => ({ ...s, heroTitle: e.target.value }))} />
                      </label>
                      <label className="field">
                        <span className="field__label">Hero subtitle</span>
                        <input className="input" value={supportPageForm.heroSubtitle} onChange={(e) => setSupportPageForm((s) => ({ ...s, heroSubtitle: e.target.value }))} />
                      </label>
                    </div>
                    <label className="field">
                      <span className="field__label">Form title</span>
                      <input className="input" value={supportPageForm.title} onChange={(e) => setSupportPageForm((s) => ({ ...s, title: e.target.value }))} />
                    </label>
                    <label className="field">
                      <span className="field__label">Form subtitle</span>
                      <textarea className="input" style={{ minHeight: 90, resize: 'vertical' }} value={supportPageForm.subtitle} onChange={(e) => setSupportPageForm((s) => ({ ...s, subtitle: e.target.value }))} />
                    </label>
                  </div>
                </div>
              ) : null}

              {selectedKey === 'about_page' ? (
                <div className="card" style={{ margin: 0 }}>
                  <div className="card__title">About page</div>
                  <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <label className="field">
                        <span className="field__label">Hero title</span>
                        <input className="input" value={aboutPageForm.heroTitle} onChange={(e) => setAboutPageForm((s) => ({ ...s, heroTitle: e.target.value }))} />
                      </label>
                      <label className="field">
                        <span className="field__label">Hero subtitle</span>
                        <input className="input" value={aboutPageForm.heroSubtitle} onChange={(e) => setAboutPageForm((s) => ({ ...s, heroSubtitle: e.target.value }))} />
                      </label>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <label className="field">
                        <span className="field__label">Mission title</span>
                        <input className="input" value={aboutPageForm.missionTitle} onChange={(e) => setAboutPageForm((s) => ({ ...s, missionTitle: e.target.value }))} />
                      </label>
                      <label className="field">
                        <span className="field__label">Mission text</span>
                        <input className="input" value={aboutPageForm.missionText} onChange={(e) => setAboutPageForm((s) => ({ ...s, missionText: e.target.value }))} />
                      </label>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <label className="field">
                        <span className="field__label">SOPs title</span>
                        <input className="input" value={aboutPageForm.sopsTitle} onChange={(e) => setAboutPageForm((s) => ({ ...s, sopsTitle: e.target.value }))} />
                      </label>
                      <label className="field">
                        <span className="field__label">SOPs subtitle</span>
                        <input className="input" value={aboutPageForm.sopsSubtitle} onChange={(e) => setAboutPageForm((s) => ({ ...s, sopsSubtitle: e.target.value }))} />
                      </label>
                    </div>
                    <div className="card" style={{ margin: 0 }}>
                      <div className="card__title">SOP list</div>
                      <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                        {aboutPageForm.sops.map((sop, idx) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <div key={idx} className="card" style={{ margin: 0 }}>
                            <div className="card__title">SOP {sop.id || idx + 1}</div>
                            <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 12 }}>
                                <label className="field">
                                  <span className="field__label">ID</span>
                                  <input className="input" value={sop.id} onChange={(e) => setAboutPageForm((s) => ({ ...s, sops: s.sops.map((x, i) => (i === idx ? { ...x, id: e.target.value } : x)) }))} />
                                </label>
                                <label className="field">
                                  <span className="field__label">Icon</span>
                                  <input className="input" value={sop.icon} onChange={(e) => setAboutPageForm((s) => ({ ...s, sops: s.sops.map((x, i) => (i === idx ? { ...x, icon: e.target.value } : x)) }))} />
                                </label>
                                <label className="field">
                                  <span className="field__label">Color</span>
                                  <input className="input" value={sop.color} onChange={(e) => setAboutPageForm((s) => ({ ...s, sops: s.sops.map((x, i) => (i === idx ? { ...x, color: e.target.value } : x)) }))} />
                                </label>
                              </div>
                              <label className="field">
                                <span className="field__label">Title</span>
                                <input className="input" value={sop.title} onChange={(e) => setAboutPageForm((s) => ({ ...s, sops: s.sops.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)) }))} />
                              </label>
                              <label className="field">
                                <span className="field__label">Description</span>
                                <textarea className="input" style={{ minHeight: 90, resize: 'vertical' }} value={sop.description} onChange={(e) => setAboutPageForm((s) => ({ ...s, sops: s.sops.map((x, i) => (i === idx ? { ...x, description: e.target.value } : x)) }))} />
                              </label>
                              <label className="field">
                                <span className="field__label">Note (optional)</span>
                                <input className="input" value={sop.note} onChange={(e) => setAboutPageForm((s) => ({ ...s, sops: s.sops.map((x, i) => (i === idx ? { ...x, note: e.target.value } : x)) }))} />
                              </label>
                              <button type="button" className="btn" onClick={() => setAboutPageForm((s) => ({ ...s, sops: s.sops.filter((_, i) => i !== idx) }))} disabled={aboutPageForm.sops.length <= 1}>
                                Remove SOP
                              </button>
                            </div>
                          </div>
                        ))}
                        <button type="button" className="btn" onClick={() => setAboutPageForm((s) => ({ ...s, sops: [...s.sops, { id: '', icon: 'Shield', title: '', description: '', note: '', color: 'blue' }] }))}>
                          Add SOP
                        </button>
                      </div>
                    </div>

                    <div className="card" style={{ margin: 0 }}>
                      <div className="card__title">Contact + accounts + social</div>
                      <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                        <label className="field">
                          <span className="field__label">Contact title</span>
                          <input className="input" value={aboutPageForm.contactTitle} onChange={(e) => setAboutPageForm((s) => ({ ...s, contactTitle: e.target.value }))} />
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <label className="field">
                            <span className="field__label">Email</span>
                            <input className="input" value={aboutPageForm.email} onChange={(e) => setAboutPageForm((s) => ({ ...s, email: e.target.value }))} />
                          </label>
                          <label className="field">
                            <span className="field__label">Email link</span>
                            <input className="input" value={aboutPageForm.emailHref} onChange={(e) => setAboutPageForm((s) => ({ ...s, emailHref: e.target.value }))} />
                          </label>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <label className="field">
                            <span className="field__label">Office line 1</span>
                            <input className="input" value={aboutPageForm.officeLine1} onChange={(e) => setAboutPageForm((s) => ({ ...s, officeLine1: e.target.value }))} />
                          </label>
                          <label className="field">
                            <span className="field__label">Office line 2</span>
                            <input className="input" value={aboutPageForm.officeLine2} onChange={(e) => setAboutPageForm((s) => ({ ...s, officeLine2: e.target.value }))} />
                          </label>
                        </div>

                        <div className="card" style={{ margin: 0 }}>
                          <div className="card__title">Phones</div>
                          <div className="card__body" style={{ display: 'grid', gap: 12 }}>
                            {aboutPageForm.phones.map((p, idx) => (
                              // eslint-disable-next-line react/no-array-index-key
                              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12, alignItems: 'end' }}>
                                <label className="field">
                                  <span className="field__label">Label</span>
                                  <input className="input" value={p.label} onChange={(e) => setAboutPageForm((s) => ({ ...s, phones: s.phones.map((x, i) => (i === idx ? { ...x, label: e.target.value } : x)) }))} />
                                </label>
                                <label className="field">
                                  <span className="field__label">tel:</span>
                                  <input className="input" value={p.href} onChange={(e) => setAboutPageForm((s) => ({ ...s, phones: s.phones.map((x, i) => (i === idx ? { ...x, href: e.target.value } : x)) }))} />
                                </label>
                                <button type="button" className="btn" onClick={() => setAboutPageForm((s) => ({ ...s, phones: s.phones.filter((_, i) => i !== idx) }))} disabled={aboutPageForm.phones.length <= 1}>
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button type="button" className="btn" onClick={() => setAboutPageForm((s) => ({ ...s, phones: [...s.phones, { label: '', href: '' }] }))}>
                              Add phone
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <label className="field">
                            <span className="field__label">UBL account</span>
                            <input className="input" value={aboutPageForm.ublAccount} onChange={(e) => setAboutPageForm((s) => ({ ...s, ublAccount: e.target.value }))} />
                          </label>
                          <label className="field">
                            <span className="field__label">UBL title</span>
                            <input className="input" value={aboutPageForm.ublTitle} onChange={(e) => setAboutPageForm((s) => ({ ...s, ublTitle: e.target.value }))} />
                          </label>
                          <label className="field">
                            <span className="field__label">Jazz account</span>
                            <input className="input" value={aboutPageForm.jazzAccount} onChange={(e) => setAboutPageForm((s) => ({ ...s, jazzAccount: e.target.value }))} />
                          </label>
                          <label className="field">
                            <span className="field__label">Jazz holder</span>
                            <input className="input" value={aboutPageForm.jazzHolder} onChange={(e) => setAboutPageForm((s) => ({ ...s, jazzHolder: e.target.value }))} />
                          </label>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                          <label className="field">
                            <span className="field__label">TikTok</span>
                            <input className="input" value={aboutPageForm.socialTikTok} onChange={(e) => setAboutPageForm((s) => ({ ...s, socialTikTok: e.target.value }))} />
                          </label>
                          <label className="field">
                            <span className="field__label">Facebook label</span>
                            <input className="input" value={aboutPageForm.socialFacebookLabel} onChange={(e) => setAboutPageForm((s) => ({ ...s, socialFacebookLabel: e.target.value }))} />
                          </label>
                          <label className="field">
                            <span className="field__label">Facebook link</span>
                            <input className="input" value={aboutPageForm.socialFacebookHref} onChange={(e) => setAboutPageForm((s) => ({ ...s, socialFacebookHref: e.target.value }))} />
                          </label>
                          <label className="field">
                            <span className="field__label">YouTube</span>
                            <input className="input" value={aboutPageForm.socialYoutube} onChange={(e) => setAboutPageForm((s) => ({ ...s, socialYoutube: e.target.value }))} />
                          </label>
                          <label className="field">
                            <span className="field__label">Instagram</span>
                            <input className="input" value={aboutPageForm.socialInstagram} onChange={(e) => setAboutPageForm((s) => ({ ...s, socialInstagram: e.target.value }))} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedKey !== 'hero' &&
              selectedKey !== 'manifesto' &&
              selectedKey !== 'compassionate_care' &&
              selectedKey !== 'top_donors' &&
              selectedKey !== 'founding_members' &&
              selectedKey !== 'services_preview' &&
              selectedKey !== 'members_preview' &&
              selectedKey !== 'services_page' &&
              selectedKey !== 'members_page' &&
              selectedKey !== 'activities_page' &&
              selectedKey !== 'donation_page' &&
              selectedKey !== 'support_page' &&
              selectedKey !== 'about_page' &&
              selectedKey !== 'footer' ? (
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
