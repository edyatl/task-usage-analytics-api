#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    Developed by @edyatl <edyatl@yandex.ru> April 2026
    https://github.com/edyatl

"""
from fastapi import APIRouter, HTTPException, Response, status
from fastapi.responses import JSONResponse

from api.auth.schemas import LoginRequest, TokenResponse
from api.auth.service import ACCESS_TOKEN_TTL_SECONDS, AuthService

auth_router = APIRouter()

_COOKIE_NAME = "access_token"


def _set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=ACCESS_TOKEN_TTL_SECONDS,   # single source of truth
    )


def _clear_auth_cookie(response: Response) -> None:
    response.delete_cookie(
        key=_COOKIE_NAME,
        httponly=True,
        secure=True,
        samesite="lax",
    )


@auth_router.post("/login", response_model=TokenResponse)
async def login(login_request: LoginRequest) -> Response:
    user = AuthService.authenticate_user(login_request.email, login_request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    access_token = AuthService.create_access_token(user)

    # JSONResponse is the actual HTTP response — cookie is attached to it,
    # not to a discarded intermediate object.
    response = JSONResponse(
        content={"access_token": access_token, "token_type": "bearer"},
    )
    _set_auth_cookie(response, access_token)
    return response


@auth_router.post("/logout", status_code=status.HTTP_200_OK)
async def logout() -> Response:
    response = JSONResponse(content={"message": "Logged out successfully"})
    _clear_auth_cookie(response)
    return response
