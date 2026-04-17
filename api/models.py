from typing import Optional
import datetime

from sqlalchemy import DateTime, Index, Integer, PrimaryKeyConstraint, String, Text, text
from sqlalchemy.dialects.postgresql import TIMESTAMP
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass


class PrismaMigrations(Base):
    __tablename__ = '_prisma_migrations'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='_prisma_migrations_pkey'),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    checksum: Mapped[str] = mapped_column(String(64), nullable=False)
    migration_name: Mapped[str] = mapped_column(String(255), nullable=False)
    started_at: Mapped[datetime.datetime] = mapped_column(DateTime(True), nullable=False, server_default=text('now()'))
    applied_steps_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default=text('0'))
    finished_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))
    logs: Mapped[Optional[str]] = mapped_column(Text)
    rolled_back_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime(True))


class DailyUsageEvents(Base):
    __tablename__ = 'daily_usage_events'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='daily_usage_events_pkey'),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False)
    date_key: Mapped[str] = mapped_column(String(10), nullable=False)
    request_id: Mapped[str] = mapped_column(String(64), nullable=False)
    status: Mapped[str] = mapped_column(String(16), nullable=False)
    reserved_at: Mapped[datetime.datetime] = mapped_column(TIMESTAMP(precision=3), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    created_at: Mapped[datetime.datetime] = mapped_column(TIMESTAMP(precision=3), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    committed_at: Mapped[Optional[datetime.datetime]] = mapped_column(TIMESTAMP(precision=3))


class Users(Base):
    __tablename__ = 'users'
    __table_args__ = (
        PrimaryKeyConstraint('id', name='users_pkey'),
        Index('users_email_key', 'email', unique=True)
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(Text, nullable=False)
    plan_tier: Mapped[str] = mapped_column(String(16), nullable=False, server_default=text("'starter'::character varying"))
    created_at: Mapped[datetime.datetime] = mapped_column(TIMESTAMP(precision=3), nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    name: Mapped[Optional[str]] = mapped_column(Text)
