import json
import os
import asyncio
from typing import Any, Optional
from redis.asyncio import Redis

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis = Redis.from_url(REDIS_URL, encoding="utf-8", decode_responses=True)

async def get_json(key: str) -> Optional[Any]:
    data = await redis.get(key)
    return json.loads(data) if data else None

async def set_json(key: str, value: Any, ttl: int = 60) -> None:
    await redis.set(key, json.dumps(value), ex=ttl)

async def delete_by_prefix(prefix: str) -> None:
    # limpa chaves do cache relacionadas
    async for key in redis.scan_iter(f"{prefix}*"):
        await redis.delete(key)
