import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../../lib/api';
import { UsageStatsResponse } from '../../../types/usage';

const useUsageStats = (days: number = 7) => {
  const clampedDays = Math.min(Math.max(days, 1), 90);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['usage', 'stats', clampedDays],
    queryFn: () => apiFetch<UsageStatsResponse>(`/api/usage/stats?days=${clampedDays}`),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return { data, isLoading, isError, error, refetch };
};

export { useUsageStats };
