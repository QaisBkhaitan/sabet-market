from decimal import Decimal

from pydantic import (
    BaseModel,
    Field,
)


class OrderItemCreate(BaseModel):
    product_id: int = Field(
        gt=0
    )

    quantity: int = Field(
        ge=1,
        le=99,
    )


class OrderCreate(BaseModel):
    customer_name: str = Field(
        min_length=2,
        max_length=150,
    )

    phone: str = Field(
        min_length=5,
        max_length=30,
    )

    # Required for every new order
    whatsapp: str = Field(
        min_length=5,
        max_length=30,
    )

    city: str = Field(
        min_length=2,
        max_length=120,
    )

    address: str = Field(
        min_length=3,
        max_length=1000,
    )

    latitude: Decimal | None = Field(
        default=None,
        ge=Decimal("-90"),
        le=Decimal("90"),
    )

    longitude: Decimal | None = Field(
        default=None,
        ge=Decimal("-180"),
        le=Decimal("180"),
    )

    notes: str | None = Field(
        default=None,
        max_length=2000,
    )

    items: list[OrderItemCreate] = Field(
        min_length=1
    )


class OrderItemResponse(BaseModel):
    product_id: int
    product_name: str

    unit_price: Decimal
    quantity: int
    line_total: Decimal


class OrderResponse(BaseModel):
    id: int
    order_number: str

    customer_name: str
    phone: str

    # Keep nullable here for old orders
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

    items: list[OrderItemResponse]