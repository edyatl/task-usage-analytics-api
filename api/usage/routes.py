from fastapi import APIRouter, Depends, Query
from typing import Annotated

from api.usage.service import UsageService
from api.usage.stats_schemas import UsageStats
from api.auth import get_current_user
from api.db import get_session

usage_router = APIRouter(prefix="/api/usage", tags=["usage"])


@usage_router.get("/stats")
async def get_usage_stats(
    days: Annotated[int | None, Query(None, ge=1, le=90)],
    user: dict = Depends(get_current_user),
    session = Depends(get_session)
):
    usage_service = UsageService()
    usage_stats = await usage_service.get_usage_stats(user["id"], days)
    return usage_stats
