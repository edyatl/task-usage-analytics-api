#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    Developed by @edyatl <edyatl@yandex.ru> April 2026
    https://github.com/edyatl

"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis import asyncio as aioredis
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy.orm import sessionmaker
from api.config import config as cfg
from api.db import init_db
from api.usage.routes import usage_router

# Logging setup
from api.logger import get_cls_logger, get_func_logger, log_entry_exit
logger = get_func_logger()

# Suppress INFO logs for specific libraries
logging.getLogger("fastapi").setLevel(logging.DEBUG if cfg.DEBUG else logging.ERROR)
logging.getLogger("sqlalchemy").setLevel(logging.DEBUG if cfg.DEBUG else logging.ERROR)

# FastAPI app initialization
app = FastAPI(title=cfg.APP_NAME)

app.include_router(usage_router, prefix="/api", tags=["usage"])

APP_URL = cfg.APP_URL

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", APP_URL],  # frontend origin here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database settings
DATABASE_URL = cfg.DATABASE_URL
engine: AsyncEngine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession
)

# Redis settings
REDIS_URL = cfg.REDIS_URL
redis_client = aioredis.from_url(REDIS_URL, password=cfg.REDIS_PASSWORD)


@app.on_event("startup")
async def test_services():
    """Test database and Redis connectivity on startup."""
    logger.info("Starting service checks...")
    
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        logger.info("Database connection: OK")
    except Exception as e:
        logger.error(f"Database connection: FAILED ({e})")
    
    try:
        await redis_client.ping()
        logger.info("Redis connection: OK")
    except Exception as e:
        logger.error(f"Redis connection: FAILED ({e})")

    logger.info("Service checks completed.")

    # Try to initialize database
    # try:
        # await init_db()
        # logger.info("Database initialization: OK")
    # except Exception as e:
        # logger.error(f"Database initialization: FAILED ({e})")


@app.get("/")
async def root():
    """Test endpoint to verify FastAPI is operating normally."""
    return {"message": "FastAPI is operating normally."}


@app.on_event("shutdown")
async def shutdown_services():
    """Gracefully close services on shutdown."""
    logger.info("Shutting down services...")
    await redis_client.close()
    await engine.dispose()
    logger.info("Services shut down successfully.")
