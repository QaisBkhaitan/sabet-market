from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    DateTime,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.db.database import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(
        primary_key=True
    )

    order_number: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        index=True,
        nullable=False,
    )

    customer_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    phone: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    whatsapp: Mapped[str | None] = mapped_column(
        String(30),
        nullable=True,
    )

    city: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    address: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    latitude: Mapped[Decimal | None] = mapped_column(
        Numeric(10, 7),
        nullable=True,
    )

    longitude: Mapped[Decimal | None] = mapped_column(
        Numeric(10, 7),
        nullable=True,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    total_amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 1),
        nullable=False,
    )

    delivery_fee: Mapped[Decimal] = mapped_column(
    Numeric(10, 1),
    nullable=False,
    default=Decimal("0.0"),
    server_default="0.0",
    )

    grand_total: Mapped[Decimal] = mapped_column(
        Numeric(10, 1),
        nullable=False,
        default=Decimal("0.0"),
        server_default="0.0",
    )

    payment_method: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="cash_on_delivery",
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="new",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    items: Mapped[list["OrderItem"]] = relationship(
        back_populates="order",
        cascade="all, delete-orphan",
    )