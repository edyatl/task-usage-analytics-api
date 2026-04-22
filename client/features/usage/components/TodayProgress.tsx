import React from 'react';
import { UsageDay } from '../../types/usage';

interface Props {
  days: UsageDay[];
  dailyLimit: number;
  plan: PlanType;
}

const TodayProgress = ({ days, dailyLimit, plan }: Props) => {
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = days.find((day) => day.date === today);

  const committed = todayEntry ? todayEntry.committed : 0;
  const utilization = todayEntry ? todayEntry.committed / dailyLimit : 0;

  const progressColor = utilization >= 0.9 ? 'bg-red-500' : utilization >= 0.7 ? 'bg-amber-500' : 'bg-indigo-500';

  return (
    <div>
      <h2 className="text-lg font-bold">Today's usage</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">{committed} / {dailyLimit} requests ({plan} plan)</p>
      <div className="relative w-full">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-3" />
        <div
          className={`${progressColor} rounded-full h-3 transition-all`}
          style={{ width: `${Math.min(utilization * 100, 100)}%` }}
        />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{Math.round(utilization * 100)}% of daily limit used</p>
    </div>
  );
};

export default TodayProgress;
