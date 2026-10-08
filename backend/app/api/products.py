from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.product import Product
from app.schemas.product import ProductResponse
from app.models.category import Category

router = APIRouter(
    prefix="/api/products",
    tags=["Products"],
)


@router.get(
    "",
    response_model=list[ProductResponse],
)
def get_products(
    featured: bool | None = None,
    search: str | None = Query(
        default=None,
        min_length=1,
    ),
    db: Session = Depends(get_db),
):
    statement = (
        select(Product)
        .join(
            Category,
            Product.category_id
            == Category.id,
        )
        .where(
            Product.is_active.is_(True),
            Category.is_active.is_(True),
        )
    )

    if featured is not None:
        statement = statement.where(
            Product.is_featured == featured
        )

    if search:
        statement = statement.where(
            Product.name_ar.ilike(
                f"%{search}%"
            )
        )

    statement = statement.order_by(
        Product.id
    )

    return db.scalars(statement).all()


@router.get(
    "/{product_id}",
    response_model=ProductResponse,
)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
):
    product = db.scalar(
    select(Product)
    .join(
        Category,
        Product.category_id
        == Category.id,
    )
    .where(
        Product.id == product_id,
        Product.is_active.is_(True),
        Category.is_active.is_(True),
    )
)

    if product is None:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    return product