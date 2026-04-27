import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { UsageDay } from '../../../types/usage';

interface Props {
  days: UsageDay[];
}

const UsageBarChart = ({ days }: Props) => {
  if (days.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">No data for this period.</p>;
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={days}>
          <XAxis
            dataKey="date"
            stroke="rgb(var(--muted-foreground))"
          />
          <YAxis stroke="rgb(var(--muted-foreground))" />

          <Tooltip
            contentStyle={{
              backgroundColor: 'rgb(var(--card))',
              borderRadius: '12px',
              border: '1px solid rgb(var(--border))',
            }}
          />

          <Bar
            dataKey="committed"
            fill="rgb(var(--primary))"
            radius={[6, 6, 0, 0]}
          />

          <Bar
            dataKey="reserved"
            fill="rgb(var(--muted-foreground))"
            radius={[6, 6, 0, 0]}
          />

          <Legend
            wrapperStyle={{
              fontSize: '12px',
              color: 'rgb(var(--muted-foreground))',
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageBarChart;
