#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    Developed by @edyatl <edyatl@yandex.ru> April 2026
    https://github.com/edyatl

"""
import pytest
from unittest.mock import Mock
from datetime import date, datetime, timedelta
from pytest_asyncio import fixture
from api.usage.service import UsageService
from api.db import AsyncSession

# Fixture for mocked UsageService
@fixture
def mock_usage_service():
    # Create a mock instance of UsageService
    mock_service = Mock(spec=UsageService)
    return mock_service

# Fixture for mocked database session
@fixture
async def mock_session():
    # Create a mock instance of AsyncSession
    mock_session = Mock(spec=AsyncSession)
    return mock_session

# Test class for UsageService
class TestUsageService:
    # Add test cases here
    async def test_only_committed_counts_in_usage_reserved_shown_separately(
        self, mock_session
    ):
        # Create test data
        user_id = 1
        date_from = date(2024, 1, 1)
        date_to = date(2024, 1, 1)
        daily_limit = 10

        # Mock database query to return specific data
        mock_result = [
            {
                "day": date(2024, 1, 1),
                "committed": 5,
                "reserved": 3,
            }
        ]
        mock_session.execute.return_value = Mock(all=Mock(return_value=mock_result))

        # Create UsageService instance
        usage_service = UsageService()

        # Call get_usage_stats method
        usage_stats = await usage_service.get_usage_stats(
            user_id, mock_session, days=1
        )

        # Assert results
        assert usage_stats.days[0].committed == 5
        assert usage_stats.days[0].reserved == 3
        assert usage_stats.days[0].utilization == 0.5
