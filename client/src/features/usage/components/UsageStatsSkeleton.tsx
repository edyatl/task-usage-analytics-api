import React from 'react';

const Pulse = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={`animate-pulse rounded-[var(--radius)] bg-muted ${className}`} style={style} />
);

const UsageStatsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Today's progress skeleton */}
      <div className="rounded-[var(--radius)] border border-border bg-card p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Pulse className="h-3 w-24" />
            <Pulse className="h-2.5 w-36" />
          </div>
          <Pulse className="h-6 w-16 rounded-full" />
        </div>
        <Pulse className="h-10 w-32" />
        <Pulse className="h-3 w-full rounded-full" />
        <div className="flex justify-between">
          <Pulse className="h-2.5 w-28" />
          <Pulse className="h-2.5 w-20" />
        </div>
      </div>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-[var(--radius)] border border-border bg-card p-5 space-y-3"
          >
            <Pulse className="h-2.5 w-20" />
            <Pulse className="h-8 w-16" />
            <Pulse className="h-2.5 w-24" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="rounded-[var(--radius)] border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <Pulse className="h-3 w-28" />
          <Pulse className="h-2.5 w-12" />
        </div>
        {/* Fake bars */}
        <div className="flex items-end gap-2 h-[200px] pt-4">
          {[60, 80, 45, 95, 55, 70, 65].map((h, i) => (
            <Pulse
              key={i}
              className="flex-1 rounded-t-md rounded-b-none"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        {/* X-axis labels */}
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <Pulse key={i} className="flex-1 h-2 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsageStatsSkeleton;
