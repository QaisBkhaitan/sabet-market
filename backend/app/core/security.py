from datetime import (
    datetime,
    timedelta,
    timezone,
)

import jwt

from pwdlib import PasswordHash

from app.core.config import settings


password_hash = PasswordHash.recommended()

ALGORITHM = "HS256"


def hash_password(
    password: str
) -> str:
    return password_hash.hash(
        password
    )


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return password_hash.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(
    admin_id: int
) -> str:
    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=
            settings.access_token_expire_minutes
        )
    )

    payload = {
        "sub": str(admin_id),
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        settings.secret_key,
        algorithm=ALGORITHM,
    )


def decode_access_token(
    token: str
) -> int | None:
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[ALGORITHM],
        )

        admin_id = payload.get("sub")

        if admin_id is None:
            return None

        return int(admin_id)

    except (
        jwt.InvalidTokenError,
        ValueError,
    ):
        return None