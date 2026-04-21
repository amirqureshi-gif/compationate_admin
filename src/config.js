export const API_BASE_URL =
  (typeof window !== 'undefined' &&
    window.__ENV__ &&
    window.__ENV__.REACT_APP_API_BASE_URL) ||
  (typeof process !== 'undefined' &&
    process.env &&
    process.env.REACT_APP_API_BASE_URL) ||
  '';

