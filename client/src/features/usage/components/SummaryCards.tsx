import { Card, CardContent } from '../../../components/ui/Card';
import { UsageSummary } from '../../../types/usage';

interface Props {
  summary: UsageSummary;
}

interface StatItem {
  label: string;
  value: string | number;
  sub: string;
  icon: string;
  delay: string;
}

const SummaryCards = ({ summary }: Props) => {
  const items: StatItem[] = [
    {
      label: 'Total Requests',
      value: summary.total_committed.toLocaleString(),
      sub: 'this period',
      icon: '⬡',
      delay: 'animation-delay-100',
    },
    {
      label: 'Daily Average',
      value: isNaN(summary.avg_daily) ? '—' : summary.avg_daily.toFixed(1),
      sub: 'requests per day',
      icon: '◈',
      delay: 'animation-delay-200',
    },
    {
      label: 'Peak Day',
      value: summary.peak_day.count,
      sub: formatDate(summary.peak_day.date),
      icon: '▲',
      delay: 'animation-delay-300',
    },
    {
      label: 'Active Streak',
      value: summary.current_streak,
      sub: summary.current_streak === 1 ? 'day running' : 'days running',
      icon: '◎',
      delay: 'animation-delay-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {items.map((item) => (
        <Card
          key={item.label}
          className={`animate-fade-up ${item.delay}`}
        >
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {item.label}
              </p>
              <span
                className="text-xs text-primary opacity-60 font-mono"
                aria-hidden
              >
                {item.icon}
              </span>
            </div>
            <p
              className="text-3xl font-display font-normal tracking-tight text-foreground"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              {item.value}
            </p>
            <p className="text-xs text-muted-foreground">{item.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

function formatDate(date?: string) {
  if (!date || !date.includes('-')) return '—';
  const [y, m, d] = date.split('-').map(Number);
  if (!y || !m || !d) return date;
  return new Date(y, m - 1, d).toLocaleString('default', {
    month: 'short',
    day: 'numeric',
  });
}

export default SummaryCards;
