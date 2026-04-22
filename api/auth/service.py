#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    Developed by @edyatl <edyatl@yandex.ru> April 2026
    https://github.com/edyatl

"""
from datetime import datetime, timedelta
from typing import Dict, Optional

import jwt
from jwt import PyJWTError
from api.config import config as settings

ALGORITHM = settings.JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7


class AuthService:
    """Service class for handling auth data."""

    @staticmethod
    def create_access_token(data: Dict) -> str:
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, settings.ECDSA_PRIVATE_KEY.replace("\\n", "\n"), algorithm=ALGORITHM
        )
        return encoded_jwt

    @staticmethod
    def decode_access_token(token: str) -> dict:
        return jwt.decode(
            token, settings.ECDSA_PUBLIC_KEY.replace("\\n", "\n"), algorithms=[ALGORITHM]
        )

    @staticmethod
    def authenticate_user(email: str, password: str) -> Optional[dict]:
        if email == "test@example.com" and password == "password":
            return {
                "sub": email,
                "user_id": 5
            }
        return None
