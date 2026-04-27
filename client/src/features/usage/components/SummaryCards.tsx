import { Card, CardContent } from '../../../components/ui/Card';
import { UsageSummary } from '../../../types/usage';

interface Props {
  summary: UsageSummary;
}

const SummaryCards = ({ summary }: Props) => {
  const items = [
    {
      label: 'Total',
      value: summary.total_committed,
      sub: 'requests this period',
    },
    {
      label: 'Average',
      value: isNaN(summary.avg_daily) ? '—' : summary.avg_daily.toFixed(1),
      sub: 'requests per day',
    },
    {
      label: 'Peak',
      value: summary.peak_day.count,
      sub: formatDate(summary.peak_day.date),
    },
    {
      label: 'Streak',
      value: summary.current_streak,
      sub: 'days in a row',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => (
        <Card
          key={item.label}
          className="rounded-2xl transition-all hover:shadow-md"
        >
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="text-2xl font-semibold tracking-tight">
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
  if (!date) return '—';
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleString('default', {
    month: 'short',
    day: 'numeric',
  });
};

export default SummaryCards;
