import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { UsageDay } from '../../../types/usage';

interface Props {
  days: UsageDay[];
  dailyLimit?: number;
}

const formatShortDate = (dateStr: string): string => {
  if (!dateStr.includes('-')) return dateStr;
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('default', {
    month: 'short',
    day: 'numeric',
  });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  const committed = payload.find((p: any) => p.dataKey === 'committed')?.value ?? 0;
  const reserved = payload.find((p: any) => p.dataKey === 'reserved')?.value ?? 0;

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-lg text-xs space-y-1.5 min-w-[140px]">
      <p className="font-medium text-foreground mb-1">{formatShortDate(label)}</p>
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-danger" />
        <span className="text-muted-foreground">Committed</span>
        <span className="ml-auto font-mono font-medium">{committed}</span>
      </div>
      {reserved > 0 && (
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground" />
          <span className="text-muted-foreground">Reserved</span>
          <span className="ml-auto font-mono font-medium">{reserved}</span>
        </div>
      )}
    </div>
  );
};

const UsageBarChart = ({ days, dailyLimit }: Props) => {
  if (days.length === 0) return <p className="text-center py-12 text-muted-foreground">No data available</p>;

  const maxTotal = Math.max(...days.map(d => d.committed + (d.reserved ?? 0)));

  // Better scaling
  const yMax = Math.max(
    dailyLimit ? dailyLimit * 1.1 : 0,
    Math.ceil(maxTotal * 1.15)
  );

  return (
    <div className="animate-fade-up">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={days}
          margin={{ top: 20, right: 12, left: 0, bottom: 8 }}
          barCategoryGap="22%"
        >
          <XAxis
            dataKey="date"
            tickFormatter={formatShortDate}
            tick={{ fontSize: 11, fill: 'rgb(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'rgb(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            domain={[0, yMax]}
            allowDecimals={false}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgb(var(--muted))/0.6', radius: 8 }} />

          {dailyLimit && (
            <ReferenceLine
              y={dailyLimit}
              stroke="rgb(var(--accent))"
              strokeDasharray="3 3"
              strokeWidth={1.5}
              label={({ viewBox }) => (
                <text
                  x={viewBox.x + viewBox.width - 4}
                  y={viewBox.y - 6}
                  fill="rgb(var(--accent))"
                  fontSize={10}
                  fontFamily="JetBrains Mono, monospace"
                  textAnchor="end"
                >
                  daily limit
                </text>
              )}
            />
          )}

          {/* Committed bars */}
        <Bar dataKey="committed" radius={[4, 4, 0, 0]} maxBarSize={42}>
          {days.map((_, index) => (
            <Cell key={`committed-${index}`} fill="rgb(var(--danger))" />
          ))}
        </Bar>

          {/* Reserved bars (stacked) */}
          <Bar
            dataKey="reserved"
            stackId="usage"
            fill="rgb(var(--muted-foreground))"
            fillOpacity={0.45}
            radius={[6, 6, 0, 0]}
            maxBarSize={42}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-danger" />
          Committed
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgb(var(--muted-foreground))', opacity: 0.45 }} />
          Reserved
        </div>
        {dailyLimit && (
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="w-6 h-px border-t-2 border-dashed" style={{ borderColor: 'rgb(var(--accent))' }} />
            Daily limit
          </div>
        )}
      </div>
    </div>
  );
};

export default UsageBarChart;
