#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    Developed by @edyatl <edyatl@yandex.ru> April 2026
    https://github.com/edyatl

"""
import jwt
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from api.auth.service import AuthService

# auto_error=False: we fall back to the cookie; Bearer header is optional.
_bearer = HTTPBearer(auto_error=False)


def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer),
) -> dict:
    """Resolve the caller identity from HttpOnly cookie or Bearer header.

    Cookie takes precedence so browser clients work without JS token handling.
    Bearer header is accepted as a fallback for API / CLI clients.
    """
    token: str | None = (
        request.cookies.get("access_token")
        or (credentials.credentials if credentials else None)
    )
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        return AuthService.decode_access_token(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
