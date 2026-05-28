import { apiFetch } from '../../../lib/api';
import { LoginPayload } from '../../../types/usage';

export async function login(payload: LoginPayload) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
