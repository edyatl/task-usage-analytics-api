import React from 'react';
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
            tickFormatter={(tick) => new Date(tick).toLocaleString('default', { weekday: 'short' })}
          />
          <YAxis />
          <Tooltip
            formatter={(value, name, props) => {
              if (name === 'committed' || name === 'reserved') {
                return [value, `${name} count`];
              }
              return [value, ''];
            }}
            labelFormatter={(label) => new Date(label).toLocaleString('default', { month: 'short', day: '2-digit' })}
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
