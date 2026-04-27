import { useState, useEffect } from 'react';
import { useUsageStats } from '../api/useUsageStats';
import UsageStatsSkeleton from './UsageStatsSkeleton';
import UsageStatsError from './UsageStatsError';
import SummaryCards from './SummaryCards';
import UsageBarChart from './UsageBarChart';
import TodayProgress from './TodayProgress';
import { Card, CardContent } from '../../../components/ui/Card';

const UsageStats = () => {
  const { data, isLoading, isError, error, refetch } = useUsageStats(7);
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Page Header */}
        <header className="animate-fade-up opacity-0 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">
              Analytics
            </p>
            <h1
              className="text-4xl md:text-5xl font-normal text-foreground leading-none"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Usage Stats
            </h1>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? (
              // Sun icon
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              // Moon icon
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </header>

        {/* Meta strip */}
        {data && (
          <div className="animate-fade-up animation-delay-100 opacity-0 flex items-center gap-3 text-xs text-muted-foreground font-mono border-b border-border pb-4">
            <span>
              {formatPeriod(data.period.from)} → {formatPeriod(data.period.to)}
            </span>
            <span className="text-border">·</span>
            <span className="text-foreground font-medium">{data.daily_limit} req/day limit</span>
            <span className="text-border">·</span>
            <span className="capitalize">{data.plan} plan</span>
          </div>
        )}

        {/* Main content */}
        {isLoading && <UsageStatsSkeleton />}

        {isError && (
          <UsageStatsError
            message={error?.message ?? 'Failed to load stats'}
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && !data && null}

        {!isLoading && !isError && data && data.days.length === 0 && (
          <div className="animate-fade-up animation-delay-200 opacity-0 text-center py-20">
            <p className="text-5xl mb-4">◎</p>
            <p
              className="text-2xl text-foreground mb-2"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              No data yet
            </p>
            <p className="text-sm text-muted-foreground">
              Start using the service to see your usage stats here.
            </p>
          </div>
        )}

        {!isLoading && !isError && data && data.days.length > 0 && (
          <>
            {/* Today's progress */}
            <TodayProgress
              days={data.days}
              dailyLimit={data.daily_limit}
              plan={data.plan}
            />

            {/* Summary stat cards */}
            <SummaryCards summary={data.summary} />

            {/* Bar chart */}
            <Card className="animate-fade-up animation-delay-400 opacity-0">
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-sm font-semibold text-foreground">
                    Daily Breakdown
                  </h2>
                  <span className="text-xs font-mono text-muted-foreground">
                    last {data.days.length}d
                  </span>
                </div>
                <UsageBarChart days={data.days} dailyLimit={data.daily_limit} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

function formatPeriod(dateStr: string) {
  if (!dateStr || !dateStr.includes('-')) return dateStr ?? '';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  return new Date(y, m - 1, d).toLocaleString('default', {
    month: 'short',
    day: 'numeric',
  });
}

export default UsageStats;
