from decimal import Decimal

from fastapi import APIRouter
from pydantic import BaseModel

from app.core.config import settings


router = APIRouter(
    prefix="/api/store-config",
    tags=["Store Config"],
)


class StoreConfigResponse(BaseModel):
    delivery_fee: Decimal


@router.get(
    "",
    response_model=StoreConfigResponse,
)
def get_store_config():
    return StoreConfigResponse(
        delivery_fee=
            settings.delivery_fee
    )