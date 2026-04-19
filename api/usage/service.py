#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    Developed by @edyatl <edyatl@yandex.ru> April 2026
    https://github.com/edyatl

"""
from datetime import date, datetime, timedelta
from typing import List
import sqlalchemy as sa
from sqlmodel import select
from sqlalchemy import func

from api.logger import get_cls_logger
from api.db import get_session
from api.config import config as settings
from api.models import Users, DailyUsageEvents   # SQLModel models
from api.usage.schemas import UsageStats   # Final response schema
from api.usage.stats_schemas import (           # All intermediate schemas
    DayStats,
    SummaryStats,
    PeakDay
)


class UsageService:
    """Service class for handling usage data."""

    def __init__(self):
        self.logger = get_cls_logger(self.__class__.__name__)

    async def get_usage_stats(self, user_id: int, days: int | None = None) -> UsageStats:
        """Get usage statistics for a given user."""
        
        # Validate input
        if days is None:
            days = 7
        days = max(1, min(90, days))
        self.logger.info(f"Getting usage stats for user {user_id} for {days} days")

        # Resolve time boundaries (UTC)
        now_ts = datetime.utcnow().replace(microsecond=0, tzinfo=None)
        date_to = now_ts.date()
        date_from = date_to - timedelta(days=days - 1)

        # Fetch user plan (one cheap query)
        async with get_session() as session:
            user = await session.execute(select(Users).where(Users.id == user_id))
            user = user.scalar()
            if user is None:
                self.logger.warning(f"User {user_id} not found")
                return UsageStats(
                    plan="unknown",
                    daily_limit=30,
                    period={"from": str(date_from), "to": str(date_to)},
                    days=[],
                    summary=SummaryStats(
                        total_committed=0,
                        avg_daily=0,
                        peak_day=PeakDay(date=str(date_to), count=0),
                        current_streak=0
                    )
                )
            plan_tier = user.plan_tier
            daily_limit = settings.TARIFF_MAP.get(plan_tier, 30)

        # Single optimized aggregation query
        async with get_session() as session:
            query = select(
                func.generate_series(date_from, date_to, '1 day').label('date'),
                func.coalesce(func.sum(func.case((DailyUsageEvents.committed_at.is_not(None), 1), else_=0)), 0).label('committed'),
                func.coalesce(func.sum(func.case((DailyUsageEvents.committed_at.is_(None), 1), else_=0)), 0).label('reserved')
            ).select_from(
                func.generate_series(date_from, date_to, '1 day').cte('dates')
            ).outerjoin(
                DailyUsageEvents,
                sa.and_(
                    DailyUsageEvents.date_key == func.generate_series(date_from, date_to, '1 day').c.date,
                    DailyUsageEvents.user_id == user_id
                )
            ).group_by(
                func.generate_series(date_from, date_to, '1 day').c.date
            )
            results = await session.execute(query)
            results = results.all()

        # Build days[] list
        days_list = []
        for result in results:
            day_stats = DayStats(
                date=str(result[0]),
                committed=result[1],
                reserved=result[2],
                limit=daily_limit,
                utilization=0 if daily_limit == 0 else round(result[1] / daily_limit, 4)
            )
            days_list.append(day_stats)

        # Compute summary in single memory pass (loop over days in reverse)
        total_committed = 0
        peak_day = PeakDay(date=str(date_to), count=0)
        current_streak = 0
        for day in reversed(days_list):
            total_committed += day.committed
            if day.committed > peak_day.count:
                peak_day = PeakDay(date=day.date, count=day.committed)
            if day.committed > 0:
                current_streak += 1
            else:
                break
        avg_daily = round(total_committed / days, 2) if days > 0 else 0

        # Return UsageStatsResponse
        return UsageStats(
            plan=plan_tier,
            daily_limit=daily_limit,
            period={"from": str(date_from), "to": str(date_to)},
            days=days_list,
            summary=SummaryStats(
                total_committed=total_committed,
                avg_daily=avg_daily,
                peak_day=peak_day,
                current_streak=current_streak
            )
        )
