#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    Developed by @edyatl <edyatl@yandex.ru> April 2026
    https://github.com/edyatl

"""
import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from pydantic import Field, ConfigDict

# Load environment variables from the .env file
project_dotenv = os.path.join(os.path.dirname(__file__), "../.env")
if os.path.exists(project_dotenv):
    load_dotenv(project_dotenv)
else:
    raise FileNotFoundError(f".env file is required but not found at {project_dotenv}")

class Configuration(BaseSettings):
    model_config = ConfigDict(
        env_file=project_dotenv,
        env_file_encoding="utf-8",
        case_sensitive=True
    )

    # Application settings
    APP_NAME: str = Field(..., json_schema_extra={"env": "APP_NAME"})
    ENVIRONMENT: str = Field(..., json_schema_extra={"env": "ENVIRONMENT"})
    DEBUG: bool = Field(True, json_schema_extra={"env": "DEBUG"})
    HOST: str = Field(..., json_schema_extra={"env": "HOST"})
    PORT: int = Field(..., json_schema_extra={"env": "PORT"})
    APP_URL: str = Field(..., json_schema_extra={"env": "APP_URL"})
    DEFAULT_LANGUAGE_CODE: str = Field("en", json_schema_extra={"env": "DEFAULT_LANGUAGE_CODE"})
    UID: int = Field(..., json_schema_extra={"env": "UID"})
    GID: int = Field(..., json_schema_extra={"env": "GID"})
    TARIFF_MAP: dict[str, int] = {"starter": 30, "pro": 100, "executive": 500}

    # Database settings
    POSTGRES_USER: str = Field(..., json_schema_extra={"env": "POSTGRES_USER"})
    POSTGRES_PASSWORD: str = Field(..., json_schema_extra={"env": "POSTGRES_PASSWORD"})
    POSTGRES_DB: str = Field(..., json_schema_extra={"env": "POSTGRES_DB"})
    DATABASE_URL: str = Field(..., json_schema_extra={"env": "DATABASE_URL"})

    # Redis settings
    REDIS_URL: str = Field(..., json_schema_extra={"env": "REDIS_URL"})
    REDIS_PASSWORD: str = Field(..., json_schema_extra={"env": "REDIS_PASSWORD"})
    REDIS_MAX_CONNECTIONS: int = Field(100, json_schema_extra={"env": "REDIS_MAX_CONNECTIONS"})

    # Authentication settings
    ECDSA_PRIVATE_KEY: str = Field(..., json_schema_extra={"env": "ECDSA_PRIVATE_KEY"})
    ECDSA_PUBLIC_KEY: str = Field(..., json_schema_extra={"env": "ECDSA_PUBLIC_KEY"})
    JWT_ALGORITHM: str = Field(..., json_schema_extra={"env": "JWT_ALGORITHM"})
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(15, json_schema_extra={"env": "JWT_ACCESS_TOKEN_EXPIRE_MINUTES"})
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = Field(7, json_schema_extra={"env": "JWT_REFRESH_TOKEN_EXPIRE_DAYS"})
    SESSION_EXPIRATION_HOURS: int = Field(24, json_schema_extra={"env": "SESSION_EXPIRATION_HOURS"})
    SESSION_DEFAULT_DEVICE: str = Field("unknown", json_schema_extra={"env": "SESSION_DEFAULT_DEVICE"})

    # API settings
    API_INTERNAL_URL: str = Field(default="http://api:8000/api")


# Access the configuration
config = Configuration()

