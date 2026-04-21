#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    Developed by @edyatl <edyatl@yandex.ru> April 2026
    https://github.com/edyatl

"""
import pytest
from unittest.mock import AsyncMock, MagicMock, Mock, patch
from datetime import date, datetime, timedelta
from types import SimpleNamespace

import pytest_asyncio
from api.usage.service import UsageService


# ── fixtures ──────────────────────────────────────────────────────────────────

@pytest_asyncio.fixture
async def mock_session():
    """Async-compatible mock of AsyncSession."""
    session = MagicMock()
    session.execute = AsyncMock()
    return session


# ── helpers ───────────────────────────────────────────────────────────────────

def _make_row(day: date, committed: int, reserved: int) -> SimpleNamespace:
    """Return an object whose attributes match the named columns in the query."""
    return SimpleNamespace(day=day, committed=committed, reserved=reserved)


def _make_user(plan_tier: str = "pro") -> SimpleNamespace:
    """Return a minimal user object."""
    return SimpleNamespace(id=1, plan_tier=plan_tier)


# ── tests ─────────────────────────────────────────────────────────────────────

class TestUsageService:

    @pytest.mark.asyncio
    async def test_only_committed_counts_in_usage_reserved_shown_separately(
        self, mock_session
    ):
        """committed and reserved are tracked independently; utilization uses
        only committed / daily_limit."""

        user_id = 1
        daily_limit = 10

        # First execute() call → user lookup (.scalars().first())
        user_result = MagicMock()
        user_result.scalars.return_value.first.return_value = _make_user("pro")

        # Second execute() call → aggregation query (.all())
        agg_result = MagicMock()
        agg_result.all.return_value = [
            _make_row(date(2024, 1, 1), committed=5, reserved=3),
        ]

        # Return different mocks on successive calls
        mock_session.execute.side_effect = [user_result, agg_result]

        # Patch settings so daily_limit is deterministic regardless of env
        with patch(
            "api.usage.service.settings",
            TARIFF_MAP={"pro": daily_limit, "unknown": 30},
        ):
            usage_service = UsageService()
            usage_stats = await usage_service.get_usage_stats(
                user_id=user_id,
                session=mock_session,
                days=1,
            )

        day = usage_stats.days[0]
        assert day.committed == 5
        assert day.reserved == 3
        assert day.utilization == pytest.approx(0.5, rel=1e-4)

    @pytest.mark.asyncio
    async def test_fetch_daily_stats_directly(self, mock_session):
        """Unit-test _fetch_daily_stats in isolation, bypassing _resolve_plan."""

        daily_limit = 10
        date_from = date(2024, 1, 1)
        date_to = date(2024, 1, 1)

        agg_result = MagicMock()
        agg_result.all.return_value = [
            _make_row(date(2024, 1, 1), committed=5, reserved=3),
        ]
        mock_session.execute.return_value = agg_result

        usage_service = UsageService()
        days_list = await usage_service._fetch_daily_stats(
            user_id=1,
            date_from=date_from,
            date_to=date_to,
            daily_limit=daily_limit,
            session=mock_session,
        )

        assert len(days_list) == 1
        assert days_list[0].committed == 5
        assert days_list[0].reserved == 3
        assert days_list[0].utilization == pytest.approx(0.5, rel=1e-4)

    @pytest.mark.asyncio
    async def test_expired_reserved_events_are_excluded(self, mock_session):
        """SQL aggregation excludes reserved events older than 15 minutes;
        _fetch_daily_stats returns only the fresh reserved count."""
        user_id = 1
        daily_limit = 10
        date_from = date(2024, 1, 1)
        date_to = date(2024, 1, 1)

        # The DB-side aggregation has already applied the 15-minute TTL filter.
        # The row returned reflects: 3 fresh reserved, 0 expired (filtered by SQL).
        agg_result = MagicMock()
        agg_result.all.return_value = [
            _make_row(date(2024, 1, 1), committed=0, reserved=3),
        ]
        mock_session.execute.return_value = agg_result

        usage_service = UsageService()
        days_list = await usage_service._fetch_daily_stats(
            user_id=user_id,
            date_from=date_from,
            date_to=date_to,
            daily_limit=daily_limit,
            session=mock_session,
        )

        assert len(days_list) == 1
        assert days_list[0].committed == 0
        assert days_list[0].reserved == 3   # expired 2 were filtered by SQL
        assert days_list[0].utilization == pytest.approx(0.0, abs=1e-4)

    @pytest.mark.asyncio
    async def test_missing_days_return_zero_values(self, mock_session):
        """If there are no usage events on a particular day, that day must still
        appear in the `days` array with committed=0, reserved=0, utilization=0."""

        user_id = 1
        daily_limit = 10
        date_from = date(2024, 1, 1)
        date_to = date(2024, 1, 5)

        # First execute() call → user lookup (.scalars().first())
        user_result = MagicMock()
        user_result.scalars.return_value.first.return_value = _make_user("pro")

        # Second execute() call → aggregation query (.all())
        agg_result = MagicMock()
        agg_result.all.return_value = [
            _make_row(date(2024, 1, 1), committed=5, reserved=3),
            _make_row(date(2024, 1, 3), committed=2, reserved=1),
            _make_row(date(2024, 1, 5), committed=8, reserved=4),
        ]

        # Return different mocks on successive calls
        mock_session.execute.side_effect = [user_result, agg_result]

        # Patch settings so daily_limit is deterministic regardless of env
        with patch(
            "api.usage.service.settings",
            TARIFF_MAP={"pro": daily_limit, "unknown": 30},
        ):
            usage_service = UsageService()
            usage_stats = await usage_service.get_usage_stats(
                user_id=user_id,
                session=mock_session,
                days=5,
            )

        expected_dates = [str(date(2024, 1, i)) for i in range(1, 6)]
        actual_dates = [day.date for day in usage_stats.days]

        assert actual_dates == expected_dates

        for day in usage_stats.days:
            if day.date in ["2024-01-01", "2024-01-03", "2024-01-05"]:
                assert day.committed > 0
                assert day.reserved > 0
                assert day.utilization > 0
            else:
                assert day.committed == 0
                assert day.reserved == 0
                assert day.utilization == 0
