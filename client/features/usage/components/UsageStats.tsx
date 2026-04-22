import React from 'react';
import useUsageStats from '../api/useUsageStats';
import UsageStatsSkeleton from './UsageStatsSkeleton';
import UsageStatsError from './UsageStatsError';
import SummaryCards from './SummaryCards';
import UsageBarChart from './UsageBarChart';
import TodayProgress from './TodayProgress';

const UsageStats = () => {
  const { data, isLoading, isError, error, refetch } = useUsageStats(7);

  if (isLoading) {
    return <UsageStatsSkeleton />;
  }

  if (isError) {
    return <UsageStatsError message={error?.message ?? 'Failed to load stats'} onRetry={refetch} />;
  }

  if (data && data.days.length === 0) {
    return (
      <div className="flex justify-center">
        <p className="text-gray-500 dark:text-gray-400">No usage data yet for this period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SummaryCards summary={data?.summary} plan={data?.plan} />
      <UsageBarChart days={data?.days} />
      <TodayProgress days={data?.days} dailyLimit={data?.daily_limit} plan={data?.plan} />
    </div>
  );
};

export default UsageStats;
