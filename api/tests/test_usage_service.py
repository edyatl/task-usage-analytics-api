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
    pass
