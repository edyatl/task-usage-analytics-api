import React from 'react';
import { UsageSummary } from '../types/usage';
import { PlanType } from '../types/usage';

interface Props {
  summary: UsageSummary;
  plan: PlanType;
}

const SummaryCards = ({ summary, plan }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <h2 className="text-3xl font-bold">{summary.total_committed}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">requests this period</p>
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <h2 className="text-3xl font-bold">{isNaN(summary.avg_daily) ? '—' : summary.avg_daily.toFixed(1)}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">requests/day</p>
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <h2 className="text-3xl font-bold">{summary.peak_day.count}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {summary.peak_day.date ? new Date(summary.peak_day.date).toLocaleString('default', { month: 'short', day: '2-digit' }) : '—'}
        </p>
      </div>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <h2 className="text-3xl font-bold">{summary.current_streak}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">days in a row</p>
      </div>
    </div>
  );
};

export default SummaryCards;
