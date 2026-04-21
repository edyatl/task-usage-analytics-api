#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    Developed by @edyatl <edyatl@yandex.ru> April 2026
    https://github.com/edyatl

"""
from fastapi import APIRouter, HTTPException, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from api.auth.schemas import LoginRequest, TokenResponse
from api.auth.service import AuthService

auth_router = APIRouter()

@auth_router.get("/")
async def auth_root():
    return {"message": "Hello from auth"}

@auth_router.post("/login", response_model=TokenResponse)
async def login(login_request: LoginRequest):
    user = AuthService.authenticate_user(login_request.email, login_request.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = AuthService.create_access_token(user)
    token_response = TokenResponse(access_token=access_token, token_type="bearer")

    response = Response(status_code=200, content={"access_token": access_token, "token_type": "bearer"})
    response.set_cookie(
        "access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=60 * 7 * 24 * 60,  # 7 days
    )

    return token_response
