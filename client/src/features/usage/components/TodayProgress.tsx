import { Card, CardContent } from '../../../components/ui/Card';
import { UsageDay } from '../../../types/usage';
import { PlanType } from '../../../types/usage';

interface Props {
  days: UsageDay[];
  dailyLimit: number;
  plan: PlanType;
}

const TodayProgress = ({ days, dailyLimit, plan }: Props) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const today = days.find((d) => d.date === todayStr);

  const committed = today?.committed ?? 0;
  const utilization = committed / dailyLimit;

  return (
    <Card>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium">Today's usage</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-muted">
            {plan}
          </span>
        </div>

        <div className="text-sm text-muted-foreground">
          {committed} / {dailyLimit} requests
        </div>

        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${Math.min(utilization * 100, 100)}%` }}
          />
        </div>

        <div className="text-xs text-muted-foreground">
          {today
            ? `${Math.round(utilization * 100)}% of daily limit`
            : 'No usage today'}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodayProgress;
