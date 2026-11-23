import { API_BASE_URL } from '../config/constants';

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('adminware_token');
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error('No fue posible conectar con el servidor de AdminWare.');
  }

  if (response.status === 401) {
    localStorage.removeItem('adminware_token');
    window.dispatchEvent(new CustomEvent('adminware:unauthorized'));
  }

  const data = response.status === 204
    ? null
    : await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || data?.error || `La solicitud falló (${response.status}).`;
    throw new Error(message);
  }

  return data;
}
