#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    Developed by @edyatl <edyatl@yandex.ru> April 2026
    https://github.com/edyatl

"""
from pydantic import BaseModel
from datetime import date
from typing import List

class DayStats(BaseModel):
    date: str
    committed: int
    reserved: int
    limit: int
    utilization: float

class PeakDay(BaseModel):
    date: str
    count: int

class SummaryStats(BaseModel):
    total_committed: int
    avg_daily: float
    peak_day: PeakDay
    current_streak: int

class UsageStats(BaseModel):
    plan: str
    daily_limit: int
    period: dict
    days: List[DayStats]
    summary: SummaryStats
