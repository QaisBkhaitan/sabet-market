from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.category import Category
from app.models.product import Product
from app.schemas.category import CategoryResponse
from app.schemas.product import ProductResponse


router = APIRouter(
    prefix="/api/categories",
    tags=["Categories"],
)


@router.get(
    "",
    response_model=list[CategoryResponse],
)
def get_categories(
    db: Session = Depends(get_db),
):
    statement = (
        select(Category)
        .where(Category.is_active.is_(True))
        .order_by(Category.id)
    )

    categories = db.scalars(statement).all()

    return categories


@router.get(
    "/{slug}/products",
    response_model=list[ProductResponse],
)
def get_category_products(
    slug: str,
    db: Session = Depends(get_db),
):
    category = db.scalar(
        select(Category).where(
            Category.slug == slug,
            Category.is_active.is_(True),
        )
    )

    if category is None:
        raise HTTPException(
            status_code=404,
            detail="Category not found",
        )

    statement = (
        select(Product)
        .where(
            Product.category_id == category.id,
            Product.is_active.is_(True),
        )
        .order_by(Product.id)
    )

    products = db.scalars(statement).all()

    return products