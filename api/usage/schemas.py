#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    Developed by @edyatl <edyatl@yandex.ru> April 2026
    https://github.com/edyatl

"""
from pydantic import BaseModel
from api.usage.stats_schemas import UsageStats

class ExampleSchema(BaseModel):
    name: str
    age: int
