import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';
import { UsageStatsResponse } from '../types/usage';

const useUsageStats = (days: number = 7) => {
  const clampedDays = Math.min(Math.max(days, 1), 90);
  const queryKey = ['usage', 'stats', clampedDays];

  const { data, isLoading, isError, error, refetch } = useQuery(
    queryKey,
    async () => {
      const response = await apiFetch<UsageStatsResponse>(`/api/usage/stats?days=${clampedDays}`);
      return response;
    }
  );

  return { data, isLoading, isError, error, refetch };
};

export { useUsageStats };
