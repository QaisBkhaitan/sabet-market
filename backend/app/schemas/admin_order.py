from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import (
    BaseModel,
    ConfigDict,
)


OrderStatus = Literal[
    "new",
    "confirmed",
    "delivered",
    "cancelled",
]


class AdminOrderStatusUpdate(BaseModel):
    status: OrderStatus


class AdminOrderItemResponse(BaseModel):
    id: int

    product_id: int
    product_name: str

    unit_price: Decimal
    quantity: int
    line_total: Decimal

    model_config = ConfigDict(
        from_attributes=True
    )


class AdminOrderResponse(BaseModel):
    id: int
    order_number: str

    customer_name: str
    phone: str
    whatsapp: str | None

    city: str
    address: str

    latitude: Decimal | None
    longitude: Decimal | None

    notes: str | None

    total_amount: Decimal
    delivery_fee: Decimal
    grand_total: Decimal
    payment_method: str
    status: str

    created_at: datetime

    items: list[
        AdminOrderItemResponse
    ]

    model_config = ConfigDict(
        from_attributes=True
    )