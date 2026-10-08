from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.db.database import engine

from app.api.categories import router as categories_router
from app.api.products import router as products_router

from app.api.admin_auth import (
    router as admin_auth_router,
)

from app.api.admin_products import (
    router as admin_products_router,
)

from pathlib import Path

from fastapi.staticfiles import StaticFiles
from app.api.orders import (
    router as orders_router,
)
from app.api.admin_orders import (
    router as admin_orders_router,
)
app = FastAPI(
    title="Jenin Supermarket API",
    version="1.0.0",
)
from app.api.admin_categories import (
    router as admin_categories_router,
)
from app.api.store_config import (
    router as store_config_router,
)
BACKEND_DIR = Path(
    __file__
).resolve().parents[1]

UPLOAD_DIR = (
    BACKEND_DIR
    / "uploads"
)

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


app.mount(
    "/uploads",
    StaticFiles(
        directory=UPLOAD_DIR
    ),
    name="uploads",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(categories_router)
app.include_router(products_router)
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
@app.get("/")
def root():
    return {
        "message": "Jenin Supermarket API is running"
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
            "database": "connected"
        }

    except Exception as error:
        return {
            "database": "error",
            "details": str(error),
        }