#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    Developed by @edyatl <edyatl@yandex.ru> April 2026
    https://github.com/edyatl

"""
import hmac
from datetime import UTC, datetime, timedelta
from typing import Any

import jwt
from jwt import ExpiredSignatureError, PyJWTError

from api.config import config as settings

_ALGORITHM: str = settings.JWT_ALGORITHM
# Single source of truth for token lifetime — cookie max_age must match.
ACCESS_TOKEN_TTL_SECONDS: int = 7 * 24 * 60 * 60  # 7 days

# Hardcoded demo credentials (replace with DB lookup in production).
_DEMO_EMAIL: str = "test@example.com"
_DEMO_PASSWORD: str = "password"
_DEMO_USER: dict[str, Any] = {"sub": _DEMO_EMAIL, "user_id": 5}


class AuthService:
    """Stateless JWT auth helpers."""

    @staticmethod
    def create_access_token(data: dict[str, Any]) -> str:
        payload = data.copy()
        payload["exp"] = datetime.now(UTC) + timedelta(seconds=ACCESS_TOKEN_TTL_SECONDS)
        return jwt.encode(
            payload,
            settings.ECDSA_PRIVATE_KEY.replace("\\n", "\n"),
            algorithm=_ALGORITHM,
        )

    @staticmethod
    def decode_access_token(token: str) -> dict[str, Any]:
        """Decode and verify *token*.

        Raises:
            jwt.ExpiredSignatureError: token is valid but past its expiry.
            jwt.PyJWTError:            token is malformed or signature invalid.
        """
        return jwt.decode(
            token,
            settings.ECDSA_PUBLIC_KEY.replace("\\n", "\n"),
            algorithms=[_ALGORITHM],
        )

    @staticmethod
    def authenticate_user(email: str, password: str) -> dict[str, Any] | None:
        """Return the user payload when credentials match, else None.

        Uses hmac.compare_digest for timing-safe comparison even on
        hardcoded values — establishes the correct pattern for production.
        """
        email_ok = hmac.compare_digest(email.lower(), _DEMO_EMAIL)
        pass_ok = hmac.compare_digest(password, _DEMO_PASSWORD)
        return _DEMO_USER.copy() if (email_ok and pass_ok) else None
