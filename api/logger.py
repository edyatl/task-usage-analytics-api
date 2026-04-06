#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    Developed by @edyatl <edyatl@yandex.ru> April 2026
    https://github.com/edyatl

"""
import logging
import sys
import inspect
import functools
from typing import Callable, Any

from api.config import config as cfg

_LOG_FORMAT = "%(asctime)s [%(module)s:%(lineno)d] %(name)-20s [%(levelname)s] %(message)s"
_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
_FORMATTER = logging.Formatter(_LOG_FORMAT, _DATE_FORMAT)


def _build_stdout_handler() -> logging.StreamHandler:
    """Return a StreamHandler writing to stdout with the shared formatter."""
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(_FORMATTER)
    return handler


def _configure_logger(logger: logging.Logger) -> logging.Logger:
    """Attach a stdout handler (once) and set level from config."""
    if not logger.handlers:
        logger.addHandler(_build_stdout_handler())
    logger.setLevel(logging.DEBUG if cfg.DEBUG else logging.INFO)
    logger.propagate = False
    return logger


def get_cls_logger(cls_name: str) -> logging.Logger:
    """
    Return a stdout logger scoped to a class.

    Usage:
        class MyService:
            _log = get_cls_logger(__qualname__)
    """
    return _configure_logger(logging.getLogger(cls_name))


def get_func_logger() -> logging.Logger:
    """
    Return a stdout logger auto-named after the calling function or module.

    Usage (inside any function or at module level):
        log = get_func_logger()
        log.info("started")
    """
    frame = inspect.currentframe().f_back
    name = (
        frame.f_globals.get("__name__", "<unknown>")
        if frame.f_code.co_name == "<module>"
        else frame.f_code.co_name
    )
    return _configure_logger(logging.getLogger(name))


def log_entry_exit(logger: logging.Logger) -> Callable:
    """
    Decorator — emit DEBUG lines on function entry and exit.

    Usage:
        @log_entry_exit(log)
        async def create_user(payload: UserIn) -> UserOut:
            ...
    """
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            logger.debug("→ %s  args=%s  kwargs=%s", func.__name__, args, kwargs)
            result = func(*args, **kwargs)
            logger.debug("← %s  result=%s", func.__name__, result)
            return result
        return wrapper
    return decorator
