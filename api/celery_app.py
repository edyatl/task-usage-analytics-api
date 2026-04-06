#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    Developed by @edyatl <edyatl@yandex.ru> April 2026
    https://github.com/edyatl

"""
import os
from celery import Celery
from celery.schedules import crontab
from api.logger import get_func_logger
from api.config import config as cfg

API_URL = cfg.API_INTERNAL_URL

# Initialize Celery app
celery_app = Celery(
    "tasks",
    broker=os.getenv("CELERY_BROKER_URL"),
    backend=os.getenv("CELERY_RESULT_BACKEND"),
)

celery_app.conf.update(
    task_routes={"tasks.*": {"queue": "default"}},
    broker_connection_retry_on_startup=True,
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    worker_prefetch_multiplier=1,
    task_acks_late=True,
    task_reject_on_worker_lost=True,
)


celery_app.conf.beat_schedule = {
    # "call-celery-task-every-24-hours": {
        # "task": "call_celery_task",
        # "schedule": crontab(hour=6, minute=0),  # Every 24 hours
    # },
}

# logger = get_func_logger()


@celery_app.task(
    name='call_celery_task',
)
def call_celery_task():
    """
    Celery task template.
    """
    pass

