from fastapi import APIRouter, Depends, Query
from typing import Annotated

from api.usage.service import UsageService
from api.usage.schemas import UsageStats
from api.auth.dependencies import get_current_user
from api.db import get_session
from api.models import Users

usage_router = APIRouter()


@usage_router.get(
    "/stats", 
    response_model=UsageStats,
    summary="Compute usage statistics for a single user over a rolling date window."
)
async def get_usage_stats(
    days: int | None = None,
    user: Users = Depends(get_current_user),
    session = Depends(get_session)
):
    usage_service = UsageService()
    usage_stats = await usage_service.get_usage_stats(user["user_id"], session, days)
    return usage_stats
