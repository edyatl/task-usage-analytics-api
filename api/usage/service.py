#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    Developed by @edyatl <edyatl@yandex.ru> April 2026
    https://github.com/edyatl

"""
from datetime import UTC, date, datetime, timedelta
from typing import Optional

import sqlalchemy as sa
from sqlalchemy import func, text
from sqlmodel import select

from api.config import config as settings
from api.db import AsyncSession
from api.logger import get_cls_logger
from api.models import DailyUsageEvents, Users
from api.usage.schemas import UsageStats
from api.usage.stats_schemas import DayStats, PeakDay, SummaryStats

_DEFAULT_DAILY_LIMIT: int = 30
_MIN_DAYS: int = 1
_MAX_DAYS: int = 90


class UsageService:
    """Compute usage statistics for a single user over a rolling date window."""

    def __init__(self) -> None:
        self.logger = get_cls_logger(self.__class__.__name__)

    async def get_usage_stats(
        self,
        user_id: int,
        session: AsyncSession,
        days: Optional[int] = None,
    ) -> UsageStats:
        """Return usage statistics for *user_id* over the last *days* calendar days.

        Args:
            user_id: Primary key of the user.
            session:  Injected async DB session.
            days:     Window length in days [1, 90]; defaults to 7.

        Returns:
            A fully populated UsageStats response model.

        Raises:
            sqlalchemy.exc.SQLAlchemyError: Propagated on DB failure after logging.
        """
        days = max(_MIN_DAYS, min(_MAX_DAYS, days if days is not None else 7))

        date_to: date = datetime.now(UTC).date()
        date_from: date = date_to - timedelta(days=days - 1)

        self.logger.info(
            "Fetching usage stats: user_id=%s days=%s range=[%s, %s]",
            user_id, days, date_from, date_to,
        )

        plan_tier, daily_limit = await self._resolve_plan(user_id, session)

        days_list = await self._fetch_daily_stats(
            user_id=user_id,
            date_from=date_from,
            date_to=date_to,
            daily_limit=daily_limit,
            session=session,
        )

        summary = self._compute_summary(days_list, days)

        return UsageStats(
            plan=plan_tier,
            daily_limit=daily_limit,
            period={"from": str(date_from), "to": str(date_to)},
            days=days_list,
            summary=summary,
        )

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    async def _resolve_plan(
        self, user_id: int, session: AsyncSession
    ) -> tuple[str, int]:
        """Return (plan_tier, daily_limit) for *user_id*.

        Returns ("unknown", default_limit) when the user row is absent.
        """
        user: Optional[Users] = (
            await session.execute(select(Users).where(Users.id == user_id))
        ).scalars().first()

        if user is None:
            self.logger.warning("User not found: user_id=%s", user_id)
            default_limit: int = settings.TARIFF_MAP.get("unknown", _DEFAULT_DAILY_LIMIT)
            return "unknown", default_limit

        plan_tier: str = user.plan_tier
        daily_limit: int = settings.TARIFF_MAP.get(plan_tier, _DEFAULT_DAILY_LIMIT)
        return plan_tier, daily_limit

    async def _fetch_daily_stats(
        self,
        *,
        user_id: int,
        date_from: date,
        date_to: date,
        daily_limit: int,
        session: AsyncSession,
    ) -> list[DayStats]:
        """Run a single aggregation query and return one DayStats per calendar day.

        Uses a PostgreSQL generate_series CTE so every date in [date_from, date_to]
        is represented even when DailyUsageEvents has no rows for that day.
        """
        # Build the date-spine CTE once; reference it by alias throughout.
        date_spine = (
            sa.select(
                func.generate_series(
                    sa.cast(date_from, sa.Date),
                    sa.cast(date_to, sa.Date),
                    sa.cast(text("'1 day'"), sa.Interval),
                ).label("day")
            ).cte("date_spine")
        )

        committed_expr = func.coalesce(
            func.sum(
                sa.case(
                    (DailyUsageEvents.committed_at.is_not(None), 1),
                    else_=0,
                )
            ),
            0,
        ).label("committed")

        reserved_expr = func.coalesce(
            func.sum(
                sa.case(
                    (DailyUsageEvents.committed_at.is_(None), 1),
                    else_=0,
                )
            ),
            0,
        ).label("reserved")

        query = (
            sa.select(date_spine.c.day, committed_expr, reserved_expr)
            .select_from(date_spine)
            .outerjoin(
                DailyUsageEvents,
                sa.and_(
                    DailyUsageEvents.date_key == date_spine.c.day,
                    DailyUsageEvents.user_id == user_id,
                ),
            )
            .group_by(date_spine.c.day)
            .order_by(date_spine.c.day)
        )

        rows = (await session.execute(query)).all()

        return [
            DayStats(
                date=str(row.day),
                committed=row.committed,
                reserved=row.reserved,
                limit=daily_limit,
                utilization=(
                    0.0 if daily_limit == 0
                    else round(row.committed / daily_limit, 4)
                ),
            )
            for row in rows
        ]

    @staticmethod
    def _compute_summary(days_list: list[DayStats], window: int) -> SummaryStats:
        """Derive summary scalars from the fully populated days list.

        Peak search is decoupled from streak calculation so neither
        corrupts the other.
        """
        if not days_list:
            empty_date = str(date.today())
            return SummaryStats(
                total_committed=0,
                avg_daily=0.0,
                peak_day=PeakDay(date=empty_date, count=0),
                current_streak=0,
            )

        total_committed: int = sum(d.committed for d in days_list)

        # Peak: full scan, no early exit.
        peak = max(days_list, key=lambda d: d.committed)
        peak_day = PeakDay(date=peak.date, count=peak.committed)

        # Streak: count consecutive non-zero days backwards from today.
        current_streak: int = 0
        for day in reversed(days_list):
            if day.committed > 0:
                current_streak += 1
            else:
                break

        avg_daily: float = (
            round(total_committed / window, 2) if window > 0 else 0.0
        )

        return SummaryStats(
            total_committed=total_committed,
            avg_daily=avg_daily,
            peak_day=peak_day,
            current_streak=current_streak,
        )
