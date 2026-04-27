import { Card, CardContent } from '../../../components/ui/Card';
import { Progress } from '../../../components/ui/Progress';
import { UsageDay, PlanType } from '../../../types/usage';

interface Props {
  days: UsageDay[];
  dailyLimit: number;
  plan: PlanType;
}

const PLAN_LABELS: Record<PlanType, string> = {
  starter: 'Starter',
  pro: 'Pro',
  executive: 'Executive',
};

const PLAN_COLORS: Record<PlanType, string> = {
  starter: 'bg-muted text-muted-foreground',
  pro: 'bg-primary/10 text-primary',
  executive: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const TodayProgress = ({ days, dailyLimit, plan }: Props) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const today = days.find((d) => d.date === todayStr);

  const committed = today?.committed ?? 0;
  const reserved = today?.reserved ?? 0;
  const total = committed + reserved;
  const utilization = total / dailyLimit;
  const pct = Math.min(utilization * 100, 100);

  const statusColor =
    pct >= 90
      ? '[&>div]:bg-[rgb(var(--danger))]'
      : pct >= 70
      ? '[&>div]:bg-[rgb(var(--warning))]'
      : '';

  const remaining = Math.max(dailyLimit - total, 0);

  return (
    <Card className="animate-fade-up animation-delay-500 opacity-0">
      <CardContent className="space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Today's Usage</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date().toLocaleDateString('default', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${PLAN_COLORS[plan]}`}
          >
            {PLAN_LABELS[plan]}
          </span>
        </div>

        {/* Count */}
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-4xl font-normal tracking-tight"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            {committed.toLocaleString()}
          </span>
          {reserved > 0 && (
            <span className="text-sm text-muted-foreground">
              +{reserved} reserved
            </span>
          )}
          <span className="text-sm text-muted-foreground ml-1">
            / {dailyLimit.toLocaleString()} req
          </span>
        </div>

        {/* Progress bar */}
        <Progress
          value={pct}
          className={`h-3 ${statusColor}`}
        />

        {/* Footer row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {today
              ? `${Math.round(pct)}% of daily limit used`
              : 'No requests today'}
          </span>
          {remaining > 0 && today && (
            <span className="font-mono">
              {remaining.toLocaleString()} remaining
            </span>
          )}
          {pct >= 100 && (
            <span className="text-[rgb(var(--danger))] font-medium">
              Limit reached
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayProgress;
