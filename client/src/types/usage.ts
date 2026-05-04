export type PlanType = 'starter' | 'pro' | 'executive';

export interface UsageDay {
  date: string;
  committed: number;
  reserved: number;
  limit: number;
  utilization: number;
}

export interface PeakDay {
  date: string;
  count: number;
}

export interface UsageSummary {
  total_committed: number;
  avg_daily: number;
  peak_day: PeakDay;
  current_streak: number;
}

export interface UsagePeriod {
  from_date: string;
  to_date: string;
}

export interface UsageStatsResponse {
  plan: PlanType;
  daily_limit: number;
  period: UsagePeriod;
  days: UsageDay[];
  summary: UsageSummary;
}
