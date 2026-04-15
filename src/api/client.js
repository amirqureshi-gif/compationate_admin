import { API_BASE_URL } from '../config';

function joinUrl(base, path) {
  const b = (base || '').replace(/\/+$/, '');
  const p = (path || '').replace(/^\/+/, '');
  return `${b}/${p}`;
}

export async function apiFetch(path, { token, method, headers, body } = {}) {
  if (!API_BASE_URL) {
    throw new Error(
      'REACT_APP_API_BASE_URL is not set. Configure it in Railway variables.'
    );
  }

  const res = await fetch(joinUrl(API_BASE_URL, path), {
    method: method || (body ? 'POST' : 'GET'),
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const contentType = res.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : await res.text().catch(() => '');

  if (!res.ok) {
    const msg =
      (payload && payload.message) ||
      (typeof payload === 'string' && payload) ||
      `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload;
}

