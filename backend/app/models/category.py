from __future__ import annotations

from sqlalchemy import (
    Boolean,
    String,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.db.database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    name_ar: Mapped[str] = mapped_column(
        String(120),
        nullable=False,
    )

    slug: Mapped[str] = mapped_column(
        String(120),
        unique=True,
        index=True,
        nullable=False,
    )

    image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    # Cloudinary public ID.
    # يستخدم عند تغيير صورة المجموعة.
    image_public_id: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    products: Mapped[
        list["Product"]
    ] = relationship(
        back_populates="category",
    )