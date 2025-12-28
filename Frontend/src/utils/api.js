// Central API helper to read base URL from environment variables.
// It prefers Vite-style `VITE_API_URL`, then common `REACT_APP_API_URL`,
// and falls back to localhost if none are provided.
const getBase = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:8000';
    }
  } catch (e) {}

  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8000';
    }
  } catch (e) {}

  return 'http://localhost:8000';
};

export const API_BASE = getBase();

export const apiFetch = (pathOrUrl, options) => {
  const isAbsolute = /^https?:\/\//i.test(pathOrUrl);
  const url = isAbsolute ? pathOrUrl : `${API_BASE}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
  return fetch(url, options);
};

export default API_BASE;
