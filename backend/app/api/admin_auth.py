from fastapi import (
    APIRouter,
    Cookie,
    Depends,
    HTTPException,
    Response,
    status,
)

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings

from app.core.security import (
    create_access_token,
    decode_access_token,
    verify_password,
)

from app.db.database import get_db
from app.models.admin import Admin

from app.schemas.admin import (
    AdminLoginRequest,
    AdminResponse,
)


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"],
)


def get_current_admin(
    admin_session: str | None = Cookie(
        default=None
    ),

    db: Session = Depends(
        get_db
    ),
) -> Admin:

    if not admin_session:
        raise HTTPException(
            status_code=
            status.HTTP_401_UNAUTHORIZED,

            detail=
            "Not authenticated",
        )


    admin_id = decode_access_token(
        admin_session
    )


    if admin_id is None:
        raise HTTPException(
            status_code=
            status.HTTP_401_UNAUTHORIZED,

            detail=
            "Invalid session",
        )


    admin = db.get(
        Admin,
        admin_id,
    )


    if (
        admin is None
        or not admin.is_active
    ):
        raise HTTPException(
            status_code=
            status.HTTP_401_UNAUTHORIZED,

            detail=
            "Admin not found",
        )


    return admin


@router.post(
    "/login",
    response_model=AdminResponse,
)
def admin_login(
    data: AdminLoginRequest,

    response: Response,

    db: Session = Depends(
        get_db
    ),
):
    admin = db.scalar(
        select(Admin).where(
            Admin.username
            == data.username
        )
    )


    if (
        admin is None
        or not verify_password(
            data.password,
            admin.password_hash,
        )
    ):
        raise HTTPException(
            status_code=
            status.HTTP_401_UNAUTHORIZED,

            detail=(
                "Invalid username "
                "or password"
            ),
        )


    token = create_access_token(
        admin.id
    )


    cookie_samesite = (
        "none"
        if settings.is_production
        else "lax"
    )


    response.set_cookie(
        key="admin_session",

        value=token,

        httponly=True,

        secure=
            settings.is_production,

        samesite=
            cookie_samesite,

        max_age=
            60 * 60 * 24,

        path="/",
    )


    return AdminResponse(
        id=admin.id,
        username=admin.username,
    )


@router.get(
    "/me",
    response_model=AdminResponse,
)
def admin_me(
    admin: Admin = Depends(
        get_current_admin
    ),
):
    return AdminResponse(
        id=admin.id,
        username=admin.username,
    )


@router.post(
    "/logout"
)
def admin_logout(
    response: Response
):
    cookie_samesite = (
        "none"
        if settings.is_production
        else "lax"
    )


    response.delete_cookie(
        key="admin_session",

        path="/",

        secure=
            settings.is_production,

        httponly=True,

        samesite=
            cookie_samesite,
    )


    return {
        "message":
        "Logged out successfully"
    }