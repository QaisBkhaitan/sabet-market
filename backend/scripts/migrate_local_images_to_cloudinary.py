import argparse
import sys

from pathlib import Path
from uuid import uuid4

import cloudinary
import cloudinary.uploader

from sqlalchemy import (
    create_engine,
    select,
)

from sqlalchemy.orm import Session


# حتى نستطيع import app عند تشغيل
# السكربت من backend/scripts
BACKEND_DIR = (
    Path(__file__)
    .resolve()
    .parents[1]
)

sys.path.insert(
    0,
    str(BACKEND_DIR),
)


from app.core.config import settings
from app.models.category import Category
from app.models.product import Product


cloudinary.config(
    cloud_name=
        settings.cloudinary_cloud_name,

    api_key=
        settings.cloudinary_api_key,

    api_secret=
        settings.cloudinary_api_secret,

    secure=True,
)


engine = create_engine(
    settings.database_url
)


def is_local_image(
    image_url: str | None,
    expected_prefix: str,
) -> bool:
    if not image_url:
        return False

    return image_url.startswith(
        expected_prefix
    )


def upload_existing_image(
    local_path: Path,
    folder: str,
) -> tuple[str, str]:
    public_id = (
        f"sabet-market/"
        f"{folder}/"
        f"{uuid4().hex}"
    )


    result = (
        cloudinary.uploader.upload(
            str(local_path),

            public_id=
                public_id,

            resource_type=
                "image",

            format=
                "webp",

            overwrite=
                False,
        )
    )


    secure_url = (
        result.get(
            "secure_url"
        )
    )

    saved_public_id = (
        result.get(
            "public_id"
        )
    )


    if (
        not secure_url
        or not saved_public_id
    ):
        raise RuntimeError(
            "Cloudinary did not return "
            "secure_url/public_id"
        )


    return (
        secure_url,
        saved_public_id,
    )


def migrate_products(
    db: Session,
    apply_changes: bool,
) -> tuple[int, int]:
    products = db.scalars(
        select(Product)
        .where(
            Product.image_url
            .startswith(
                "/uploads/products/"
            )
        )
    ).all()


    migrated = 0
    failed = 0


    print()
    print(
        "========== PRODUCTS =========="
    )

    print(
        f"Found: {len(products)}"
    )


    for product in products:
        image_url = (
            product.image_url
        )


        if not is_local_image(
            image_url,
            "/uploads/products/",
        ):
            continue


        local_path = (
            BACKEND_DIR
            / image_url.lstrip("/")
        )


        print()
        print(
            f"[Product #{product.id}] "
            f"{product.name_ar}"
        )

        print(
            f"Local: {local_path}"
        )


        if not local_path.exists():
            print(
                "  SKIP: file not found"
            )

            failed += 1
            continue


        if not apply_changes:
            print(
                "  DRY RUN: ready to migrate"
            )

            continue


        new_public_id = None


        try:
            (
                new_url,
                new_public_id,
            ) = upload_existing_image(
                local_path=
                    local_path,

                folder=
                    "products",
            )


            product.image_url = (
                new_url
            )

            product.image_public_id = (
                new_public_id
            )


            db.commit()


            migrated += 1


            print(
                "  OK"
            )

            print(
                f"  URL: {new_url}"
            )


        except Exception as exc:
            db.rollback()

            failed += 1


            if new_public_id:
                try:
                    cloudinary.uploader.destroy(
                        new_public_id,
                        resource_type=
                            "image",
                        invalidate=True,
                    )

                except Exception:
                    pass


            print(
                f"  ERROR: {exc}"
            )


    return (
        migrated,
        failed,
    )


def migrate_categories(
    db: Session,
    apply_changes: bool,
) -> tuple[int, int]:
    categories = db.scalars(
        select(Category)
        .where(
            Category.image_url
            .startswith(
                "/uploads/categories/"
            )
        )
    ).all()


    migrated = 0
    failed = 0


    print()
    print(
        "========== CATEGORIES =========="
    )

    print(
        f"Found: {len(categories)}"
    )


    for category in categories:
        image_url = (
            category.image_url
        )


        if not is_local_image(
            image_url,
            "/uploads/categories/",
        ):
            continue


        local_path = (
            BACKEND_DIR
            / image_url.lstrip("/")
        )


        print()
        print(
            f"[Category #{category.id}] "
            f"{category.name_ar}"
        )

        print(
            f"Local: {local_path}"
        )


        if not local_path.exists():
            print(
                "  SKIP: file not found"
            )

            failed += 1
            continue


        if not apply_changes:
            print(
                "  DRY RUN: ready to migrate"
            )

            continue


        new_public_id = None


        try:
            (
                new_url,
                new_public_id,
            ) = upload_existing_image(
                local_path=
                    local_path,

                folder=
                    "categories",
            )


            category.image_url = (
                new_url
            )

            category.image_public_id = (
                new_public_id
            )


            db.commit()


            migrated += 1


            print(
                "  OK"
            )

            print(
                f"  URL: {new_url}"
            )


        except Exception as exc:
            db.rollback()

            failed += 1


            if new_public_id:
                try:
                    cloudinary.uploader.destroy(
                        new_public_id,
                        resource_type=
                            "image",
                        invalidate=True,
                    )

                except Exception:
                    pass


            print(
                f"  ERROR: {exc}"
            )


    return (
        migrated,
        failed,
    )


def main():
    parser = argparse.ArgumentParser(
        description=(
            "Migrate local supermarket "
            "images to Cloudinary"
        )
    )


    parser.add_argument(
        "--apply",
        action="store_true",
        help=(
            "Actually upload and update DB. "
            "Without this flag only a dry run "
            "is performed."
        ),
    )


    args = parser.parse_args()


    apply_changes = (
        args.apply
    )


    print()
    print(
        "================================="
    )

    if apply_changes:
        print(
            "MODE: APPLY"
        )
    else:
        print(
            "MODE: DRY RUN"
        )

    print(
        "================================="
    )


    with Session(engine) as db:
        (
            products_migrated,
            products_failed,
        ) = migrate_products(
            db,
            apply_changes,
        )


        (
            categories_migrated,
            categories_failed,
        ) = migrate_categories(
            db,
            apply_changes,
        )


    print()
    print(
        "================================="
    )

    print(
        "SUMMARY"
    )

    print(
        "================================="
    )


    if apply_changes:
        print(
            f"Products migrated: "
            f"{products_migrated}"
        )

        print(
            f"Categories migrated: "
            f"{categories_migrated}"
        )

    print(
        f"Products failed/skipped: "
        f"{products_failed}"
    )

    print(
        f"Categories failed/skipped: "
        f"{categories_failed}"
    )


    if not apply_changes:
        print()
        print(
            "No changes were made."
        )

        print(
            "If everything above looks "
            "correct, run again with --apply."
        )


if __name__ == "__main__":
    main()