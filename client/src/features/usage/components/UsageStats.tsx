import { useState, useEffect } from 'react';
import { useUsageStats } from '../api/useUsageStats';
import UsageStatsSkeleton from './UsageStatsSkeleton';
import UsageStatsError from './UsageStatsError';
import SummaryCards from './SummaryCards';
import UsageBarChart from './UsageBarChart';
import TodayProgress from './TodayProgress';
import { SpinnerIcon } from '../../auth/components/AuthGate';

interface Props {
  onLogout: () => Promise<void>;
}

const UsageStats = ({ onLogout }: Props) => {
  const { data, isLoading, isError, error, refetch } = useUsageStats(7);

  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  );
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await onLogout();
    } finally {
      // AuthGate will unmount this component; setLoggingOut is a no-op at that point
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              Usage Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor your daily AI usage and limits
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Sign out button */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className={[
                'flex items-center gap-1.5 h-9 px-3',
                'rounded-full border border-border bg-card',
                'text-xs font-medium text-muted-foreground',
                'hover:text-foreground hover:border-foreground/30',
                'transition-all duration-150',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              ].join(' ')}
              aria-label="Sign out"
            >
              {loggingOut ? (
                <>
                  <SpinnerIcon className="w-3.5 h-3.5" />
                  <span>Signing out…</span>
                </>
              ) : (
                <>
                  <LogoutIcon className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </>
              )}
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDark((d) => !d)}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
              aria-label="Toggle dark mode"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>

        {/* Meta */}
        {data && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground font-mono">
            <span className="capitalize">{data.plan} Plan</span>
            <span className="text-border">•</span>
            <span>{data.daily_limit} requests / day</span>
            {data.period?.from_date && data.period?.to_date && (
              <>
                <span className="text-border">•</span>
                <span>
                  {formatPeriod(data.period.from_date)} — {formatPeriod(data.period.to_date)}
                </span>
              </>
            )}
          </div>
        )}

        {/* States */}
        {isLoading && <UsageStatsSkeleton />}
        {isError && (
          <UsageStatsError
            message={error?.message ?? 'Failed to load usage data'}
            onRetry={refetch}
          />
        )}

        {!isLoading && !isError && data && data.days.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-6 opacity-40">◎</p>
            <p className="text-2xl font-light text-foreground mb-2">No usage data yet</p>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Once you start using the AI assistant, your daily usage will appear here.
            </p>
          </div>
        )}

        {!isLoading && !isError && data && data.days.length > 0 && (
          <div className="space-y-10">
            <TodayProgress days={data.days} dailyLimit={data.daily_limit} plan={data.plan} />
            <SummaryCards summary={data.summary} />
            <div className="rounded-[var(--radius)] border border-border bg-card overflow-hidden">
              <div className="p-6 pb-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Daily Usage</h2>
                <p className="text-sm text-muted-foreground">Last {data.days.length} days</p>
              </div>
              <div className="p-6">
                <UsageBarChart days={data.days} dailyLimit={data.daily_limit} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// -- Utilities --------------------------------------------------------

function formatPeriod(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
}

// -- Icons ------------------------------------------------------------

function LogoutIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default UsageStats;
