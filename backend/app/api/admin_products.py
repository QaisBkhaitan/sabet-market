from decimal import Decimal

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.admin_auth import (
    get_current_admin,
)

from app.db.database import get_db

from app.models.admin import Admin
from app.models.category import Category
from app.models.product import Product

from app.schemas.product import (
    ProductAvailabilityUpdate,
    ProductResponse,
    ProductVisibilityUpdate,
)

from app.services.image_storage import (
    delete_image,
    upload_image,
)


router = APIRouter(
    prefix="/api/admin/products",
    tags=["Admin Products"],
)


# =========================
# GET ALL PRODUCTS
# =========================

@router.get(
    "",
    response_model=list[ProductResponse],
)
def admin_get_products(
    db: Session = Depends(get_db),

    admin: Admin = Depends(
        get_current_admin
    ),
):
    products = db.scalars(
        select(Product)
        .order_by(Product.id.desc())
    ).all()

    return products


# =========================
# CREATE PRODUCT
# =========================

@router.post(
    "",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
)
async def admin_create_product(
    name_ar: str = Form(...),

    description_ar: str | None = Form(
        default=None
    ),

    price: Decimal = Form(...),

    category_id: int = Form(...),

    is_available: bool = Form(
        default=True
    ),

    is_featured: bool = Form(
        default=False
    ),

    image: UploadFile | None = File(
        default=None
    ),

    db: Session = Depends(get_db),

    admin: Admin = Depends(
        get_current_admin
    ),
):
    cleaned_name = (
        name_ar.strip()
    )


    if not cleaned_name:
        raise HTTPException(
            status_code=400,
            detail="اسم المنتج مطلوب",
        )


    if price <= 0:
        raise HTTPException(
            status_code=400,
            detail="السعر غير صالح",
        )


    category = db.get(
        Category,
        category_id,
    )


    if (
        category is None
        or not category.is_active
    ):
        raise HTTPException(
            status_code=400,
            detail="المجموعة غير صالحة",
        )


    image_url: str | None = None
    image_public_id: str | None = None


    try:
        # رفع الصورة إلى Cloudinary
        if (
            image is not None
            and image.filename
        ):
            (
                image_url,
                image_public_id,
            ) = await upload_image(
                uploaded_file=image,
                folder="products",
            )


        product = Product(
            name_ar=
                cleaned_name,

            description_ar=(
                description_ar.strip()
                if (
                    description_ar
                    and description_ar.strip()
                )
                else None
            ),

            price=
                price,

            category_id=
                category_id,

            image_url=
                image_url,

            image_public_id=
                image_public_id,

            is_available=
                is_available,

            is_featured=
                is_featured,

            is_active=
                True,
        )


        db.add(
            product
        )

        db.commit()

        db.refresh(
            product
        )


        return product


    except HTTPException:
        db.rollback()

        # إذا الصورة انرفعت لكن
        # حفظ المنتج فشل نحذفها.
        if image_public_id:
            delete_image(
                image_public_id
            )

        raise


    except Exception:
        db.rollback()

        if image_public_id:
            delete_image(
                image_public_id
            )

        raise


# =========================
# UPDATE PRODUCT
# =========================

@router.put(
    "/{product_id}",
    response_model=ProductResponse,
)
async def admin_update_product(
    product_id: int,

    name_ar: str | None = Form(
        default=None
    ),

    description_ar: str | None = Form(
        default=None
    ),

    price: Decimal | None = Form(
        default=None
    ),

    category_id: int | None = Form(
        default=None
    ),

    is_available: bool | None = Form(
        default=None
    ),

    is_featured: bool | None = Form(
        default=None
    ),

    image: UploadFile | None = File(
        default=None
    ),

    db: Session = Depends(get_db),

    admin: Admin = Depends(
        get_current_admin
    ),
):
    product = db.get(
        Product,
        product_id,
    )


    if product is None:
        raise HTTPException(
            status_code=404,
            detail="المنتج غير موجود",
        )


    if name_ar is not None:
        cleaned_name = (
            name_ar.strip()
        )

        if not cleaned_name:
            raise HTTPException(
                status_code=400,
                detail="اسم المنتج غير صالح",
            )

        product.name_ar = (
            cleaned_name
        )


    if description_ar is not None:
        product.description_ar = (
            description_ar.strip()
            if description_ar.strip()
            else None
        )


    if price is not None:
        if price <= 0:
            raise HTTPException(
                status_code=400,
                detail="السعر غير صالح",
            )

        product.price = (
            price
        )


    if category_id is not None:
        category = db.get(
            Category,
            category_id,
        )

        if (
            category is None
            or not category.is_active
        ):
            raise HTTPException(
                status_code=400,
                detail="المجموعة غير صالحة",
            )

        product.category_id = (
            category_id
        )


    if is_available is not None:
        product.is_available = (
            is_available
        )


    if is_featured is not None:
        product.is_featured = (
            is_featured
        )


    old_image_public_id = (
        product.image_public_id
    )

    new_image_public_id: str | None = None


    try:
        # صورة جديدة للمنتج
        if (
            image is not None
            and image.filename
        ):
            (
                new_image_url,
                new_image_public_id,
            ) = await upload_image(
                uploaded_file=image,
                folder="products",
            )


            product.image_url = (
                new_image_url
            )

            product.image_public_id = (
                new_image_public_id
            )


        db.commit()

        db.refresh(
            product
        )


        # حذف الصورة القديمة من Cloudinary
        # فقط بعد نجاح PostgreSQL.
        if (
            new_image_public_id
            and old_image_public_id
            and old_image_public_id
            != new_image_public_id
        ):
            delete_image(
                old_image_public_id
            )


        return product


    except HTTPException:
        db.rollback()

        # DB فشل بعد رفع الصورة الجديدة،
        # نحذف الجديدة ونترك القديمة.
        if new_image_public_id:
            delete_image(
                new_image_public_id
            )

        raise


    except Exception:
        db.rollback()

        if new_image_public_id:
            delete_image(
                new_image_public_id
            )

        raise


# =========================
# AVAILABILITY
# =========================

@router.patch(
    "/{product_id}/availability",
    response_model=ProductResponse,
)
def update_product_availability(
    product_id: int,

    data: ProductAvailabilityUpdate,

    db: Session = Depends(get_db),

    admin: Admin = Depends(
        get_current_admin
    ),
):
    product = db.get(
        Product,
        product_id,
    )


    if product is None:
        raise HTTPException(
            status_code=404,
            detail="المنتج غير موجود",
        )


    product.is_available = (
        data.is_available
    )


    db.commit()

    db.refresh(
        product
    )


    return product


# =========================
# VISIBILITY
# =========================

@router.patch(
    "/{product_id}/visibility",
    response_model=ProductResponse,
)
def update_product_visibility(
    product_id: int,

    data: ProductVisibilityUpdate,

    db: Session = Depends(get_db),

    admin: Admin = Depends(
        get_current_admin
    ),
):
    product = db.get(
        Product,
        product_id,
    )


    if product is None:
        raise HTTPException(
            status_code=404,
            detail="المنتج غير موجود",
        )


    product.is_active = (
        data.is_active
    )


    db.commit()

    db.refresh(
        product
    )


    return product