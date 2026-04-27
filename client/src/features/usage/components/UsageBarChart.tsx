import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { UsageDay } from '../../../types/usage';

interface Props {
  days: UsageDay[];
  dailyLimit?: number;
}

const formatShortDate = (dateStr: unknown): string => {
  if (typeof dateStr !== 'string' || !dateStr.includes('-')) return String(dateStr ?? '');
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  return new Date(y, m - 1, d).toLocaleString('default', {
    month: 'short',
    day: 'numeric',
  });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const committed = payload.find((p: any) => p.dataKey === 'committed')?.value ?? 0;
  const reserved = payload.find((p: any) => p.dataKey === 'reserved')?.value ?? 0;

  return (
    <div
      className="rounded-xl border border-border bg-card px-4 py-3 shadow-lg text-xs space-y-1.5"
      style={{ minWidth: 140 }}
    >
      <p className="font-medium text-foreground mb-1">{formatShortDate(label)}</p>
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-primary" />
        <span className="text-muted-foreground">Committed</span>
        <span className="ml-auto font-mono font-medium text-foreground">{committed}</span>
      </div>
      {reserved > 0 && (
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: 'rgb(var(--muted-foreground))' }}
          />
          <span className="text-muted-foreground">Reserved</span>
          <span className="ml-auto font-mono font-medium text-foreground">{reserved}</span>
        </div>
      )}
    </div>
  );
};

const UsageBarChart = ({ days, dailyLimit }: Props) => {
  if (days.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No data for this period.
      </p>
    );
  }

  const maxVal = Math.max(...days.map((d) => d.committed + (d.reserved ?? 0)));

  return (
    <div className="animate-fade-up animation-delay-300 opacity-0">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={days}
          margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
          barCategoryGap="28%"
        >
          <XAxis
            dataKey="date"
            tickFormatter={formatShortDate}
            tick={{
              fontSize: 11,
              fill: 'rgb(var(--muted-foreground))',
              fontFamily: 'DM Sans, sans-serif',
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{
              fontSize: 11,
              fill: 'rgb(var(--muted-foreground))',
              fontFamily: 'DM Sans, sans-serif',
            }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            domain={[0, Math.ceil(maxVal * 1.2) || 10]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              fill: 'rgb(var(--muted))',
              radius: 6,
            }}
          />
          {dailyLimit && (
            <ReferenceLine
              y={dailyLimit}
              stroke="rgb(var(--accent))"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'limit',
                fontSize: 10,
                fill: 'rgb(var(--accent))',
                fontFamily: 'JetBrains Mono, monospace',
                position: 'insideTopRight',
                dy: -4,
              }}
            />
          )}
          <Bar
            dataKey="committed"
            stackId="a"
            radius={[0, 0, 0, 0]}
            maxBarSize={40}
          >
            {days.map((day, index) => {
              const utilization = dailyLimit
                ? (day.committed + (day.reserved ?? 0)) / dailyLimit
                : 0;
              const color =
                utilization >= 0.9
                  ? 'rgb(var(--danger))'
                  : utilization >= 0.7
                  ? 'rgb(var(--warning))'
                  : 'rgb(var(--primary))';
              // round top corners only if no reserved bar stacked on top
              const hasReserved = (day.reserved ?? 0) > 0;
              return (
                <Cell
                  key={index}
                  fill={color}
                  radius={hasReserved ? 0 : 5}
                />
              );
            })}
          </Bar>
          <Bar
            dataKey="reserved"
            stackId="a"
            radius={[5, 5, 0, 0]}
            fill="rgb(var(--muted-foreground))"
            fillOpacity={0.35}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 px-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="inline-block w-2.5 h-2.5 rounded-sm bg-primary" />
          Committed
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="inline-block w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: 'rgb(var(--muted-foreground))', opacity: 0.4 }}
          />
          Reserved
        </div>
        {dailyLimit && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
            <span
              className="inline-block w-4 border-t-2 border-dashed"
              style={{ borderColor: 'rgb(var(--accent))' }}
            />
            Daily limit
          </div>
        )}
      </div>
    </div>
  );
};

export default UsageBarChart;
