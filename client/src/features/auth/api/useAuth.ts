import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../../lib/api';

export function useAuth() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: () => apiFetch('/api/auth/me'),
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true, // re-check auth when user returns to tab
  });
}
