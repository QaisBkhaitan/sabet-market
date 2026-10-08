from uuid import uuid4

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

from app.schemas.category import (
    CategoryResponse,
    CategoryVisibilityUpdate,
)

from app.services.image_storage import (
    delete_image,
    upload_image,
)


router = APIRouter(
    prefix="/api/admin/categories",
    tags=["Admin Categories"],
)


# =========================
# GET ALL CATEGORIES
# =========================

@router.get(
    "",
    response_model=list[CategoryResponse],
)
def admin_get_categories(
    db: Session = Depends(get_db),

    admin: Admin = Depends(
        get_current_admin
    ),
):
    categories = db.scalars(
        select(Category)
        .order_by(Category.id.desc())
    ).all()

    return categories


# =========================
# CREATE CATEGORY
# =========================

@router.post(
    "",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def admin_create_category(
    name_ar: str = Form(...),

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
            detail="اسم المجموعة مطلوب",
        )


    slug = (
        f"category-{uuid4().hex[:10]}"
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
                folder="categories",
            )


        category = Category(
            name_ar=
                cleaned_name,

            slug=
                slug,

            image_url=
                image_url,

            image_public_id=
                image_public_id,

            is_active=
                True,
        )


        db.add(
            category
        )

        db.commit()

        db.refresh(
            category
        )


        return category


    except HTTPException:
        db.rollback()

        # إذا رفعنا الصورة ثم فشل حفظ DB،
        # نحذف الصورة من Cloudinary.
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
# UPDATE CATEGORY
# =========================

@router.put(
    "/{category_id}",
    response_model=CategoryResponse,
)
async def admin_update_category(
    category_id: int,

    name_ar: str | None = Form(
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
    category = db.get(
        Category,
        category_id,
    )


    if category is None:
        raise HTTPException(
            status_code=404,
            detail="المجموعة غير موجودة",
        )


    if name_ar is not None:
        cleaned_name = (
            name_ar.strip()
        )

        if not cleaned_name:
            raise HTTPException(
                status_code=400,
                detail="اسم المجموعة غير صالح",
            )

        category.name_ar = (
            cleaned_name
        )


    old_image_public_id = (
        category.image_public_id
    )

    new_image_public_id: str | None = None


    try:
        # إذا الأدمن اختار صورة جديدة
        if (
            image is not None
            and image.filename
        ):
            (
                new_image_url,
                new_image_public_id,
            ) = await upload_image(
                uploaded_file=image,
                folder="categories",
            )


            category.image_url = (
                new_image_url
            )

            category.image_public_id = (
                new_image_public_id
            )


        db.commit()

        db.refresh(
            category
        )


        # نحذف الصورة القديمة من Cloudinary
        # فقط بعد نجاح تحديث PostgreSQL.
        if (
            new_image_public_id
            and old_image_public_id
            and old_image_public_id
            != new_image_public_id
        ):
            delete_image(
                old_image_public_id
            )


        return category


    except HTTPException:
        db.rollback()

        # إذا الصورة الجديدة انرفعت لكن
        # عملية DB فشلت، نحذف الجديدة.
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
# VISIBILITY
# =========================

@router.patch(
    "/{category_id}/visibility",
    response_model=CategoryResponse,
)
def admin_set_category_visibility(
    category_id: int,

    data: CategoryVisibilityUpdate,

    db: Session = Depends(get_db),

    admin: Admin = Depends(
        get_current_admin
    ),
):
    category = db.get(
        Category,
        category_id,
    )


    if category is None:
        raise HTTPException(
            status_code=404,
            detail="المجموعة غير موجودة",
        )


    category.is_active = (
        data.is_active
    )


    db.commit()

    db.refresh(
        category
    )


    return category