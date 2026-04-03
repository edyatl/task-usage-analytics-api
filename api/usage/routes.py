#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    Developed by @edyatl <edyatl@yandex.ru> April 2026
    https://github.com/edyatl

"""
from fastapi import APIRouter

usage_router = APIRouter()

@usage_router.get("/")
async def usage_root():
    return {"message": "Hello from usage"}
