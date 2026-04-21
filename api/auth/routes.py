#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    Developed by @edyatl <edyatl@yandex.ru> April 2026
    https://github.com/edyatl

"""
from fastapi import APIRouter

auth_router = APIRouter()

@auth_router.get("/")
async def auth_root():
    return {"message": "Hello from auth"}
