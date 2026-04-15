import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../api/client';

const AuthContext = createContext(null);

const STORAGE_KEY = 'ca_admin_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      if (!token) {
        setMe(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await apiFetch('auth/me', { token });
        if (!cancelled) setMe(data);
      } catch {
        if (!cancelled) {
          setMe(null);
          setToken('');
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch {}
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMe();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      me,
      loading,
      async login({ email, password }) {
        const data = await apiFetch('auth/login', {
          method: 'POST',
          body: { email, password }
        });

        const t = data && data.token ? String(data.token) : '';
        if (!t) throw new Error('Login succeeded but no token returned.');

        setToken(t);
        try {
          localStorage.setItem(STORAGE_KEY, t);
        } catch {}
      },
      logout() {
        setToken('');
        setMe(null);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
      }
    }),
    [token, me, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

