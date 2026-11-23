import { apiRequest } from '../../../services/apiService';

export function login(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function logout() {
  localStorage.removeItem('adminware_token');
  return Promise.resolve();
}
