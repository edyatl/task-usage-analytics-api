import { apiFetch } from '../../../lib/api';

export async function logout() {
  return apiFetch('/api/auth/logout', {
    method: 'POST',
  });
}

