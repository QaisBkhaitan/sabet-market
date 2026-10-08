from fastapi import (
    FastAPI,
    HTTPException,
    Request,
)

from fastapi.middleware.cors import (
    CORSMiddleware,
)

from fastapi.responses import (
    JSONResponse,
)

from sqlalchemy import text


from app.core.config import settings
from app.db.database import engine

from app.api.categories import (
    router as categories_router,
)

from app.api.products import (
    router as products_router,
)

from app.api.admin_auth import (
    router as admin_auth_router,
)

from app.api.admin_products import (
    router as admin_products_router,
)

from app.api.admin_categories import (
    router as admin_categories_router,
)

from app.api.orders import (
    router as orders_router,
)

from app.api.admin_orders import (
    router as admin_orders_router,
)

from app.api.store_config import (
    router as store_config_router,
)


app = FastAPI(
    title="Sabet Market API",
    version="1.0.0",
)


# =========================
# CORS
# =========================

frontend_origin = (
    settings.frontend_url
    .strip()
    .rstrip("/")
)


allowed_origins = {
    "http://localhost:5173",
}


if frontend_origin:
    allowed_origins.add(
        frontend_origin
    )


app.add_middleware(
    CORSMiddleware,

    allow_origins=list(
        allowed_origins
    ),

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =========================
# ADMIN ORIGIN PROTECTION
# =========================

@app.middleware("http")
async def protect_admin_origin(
    request: Request,
    call_next,
):
    protected_methods = {
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
    }


    if (
        request.url.path.startswith(
            "/api/admin/"
        )
        and request.method
        in protected_methods
    ):
        origin = (
            request.headers.get(
                "origin"
            )
        )


        if origin:
            normalized_origin = (
                origin.rstrip("/")
            )


            if (
                normalized_origin
                not in allowed_origins
            ):
                return JSONResponse(
                    status_code=403,
                    content={
                        "detail":
                        "Origin not allowed"
                    },
                )


    return await call_next(
        request
    )


# =========================
# ROUTERS
# =========================

app.include_router(
    categories_router
)

app.include_router(
    products_router
)

app.include_router(
    admin_auth_router
)

app.include_router(
    admin_products_router
)

app.include_router(
    admin_categories_router
)

app.include_router(
    orders_router
)

app.include_router(
    admin_orders_router
)

app.include_router(
    store_config_router
)


# =========================
# HEALTH
# =========================

@app.get("/")
def root():
    return {
        "message":
        "Sabet Market API is running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "ok"
    }


@app.get("/api/database-health")
def database_health():
    try:
        with engine.connect() as connection:
            connection.execute(
                text("SELECT 1")
            )

        return {
            "database":
            "connected"
        }

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable",
        )