import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { UsageDay } from '../../types/usage';

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
            tickFormatter={(tick: string) => {
              const [y, m, d] = tick.split('-').map(Number);
              return new Date(y, m - 1, d).toLocaleString('default', { weekday: 'short' });
            }}
          />
          <YAxis />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid #374151', borderRadius: '8px', color: 'inherit' }}
            formatter={(value: number, name: string) => {
              if (name === 'committed' || name === 'reserved') {
                return [value, `${name} count`];
              }
              return [value, ''];
            }}
            labelFormatter={(label: string) => {
              const [y, m, d] = label.split('-').map(Number);
              return new Date(y, m - 1, d).toLocaleString('default', { month: 'short', day: 'numeric' });
            }}
          />
          <Bar dataKey="committed" fill="#6366f1" />
          <Bar dataKey="reserved" fill="#a5b4fc" />
          <Legend />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageBarChart;
