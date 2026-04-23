import { useUsageStats } from '../api/useUsageStats';
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

  if (!data) return null;

  if (data.days.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-gray-500">
        <div>
          <span>📊</span>
          <h2>No data yet</h2>
          <p>Start using the service to see your usage stats here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <header>
        <h1 className="text-xl font-semibold">Usage Statistics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Last 7 days · {data.plan} plan · {data.daily_limit} req/day limit
        </p>
      </header>
      <div className="space-y-6 mt-4">
        <SummaryCards summary={data.summary} />
        <UsageBarChart days={data.days} />
        <TodayProgress days={data.days} dailyLimit={data.daily_limit} plan={data.plan} />
      </div>
    </div>
  );
};

export default UsageStats;
