from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
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


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    name_ar: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    description_ar: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

   
    image_public_id: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    price: Mapped[Decimal] = mapped_column(
        Numeric(10, 1),
        nullable=False,
    )

    category_id: Mapped[int] = mapped_column(
        ForeignKey(
            "categories.id"
        ),
        nullable=False,
        index=True,
    )

    is_available: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(
            timezone=True
        ),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(
            timezone=True
        ),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    category: Mapped["Category"] = relationship(
        back_populates="products",
    )