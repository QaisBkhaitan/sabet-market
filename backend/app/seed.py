from decimal import Decimal

from sqlalchemy import select

from app.db.database import SessionLocal
from app.models.category import Category
from app.models.product import Product


categories_data = [
    {
        "name_ar": "الأرز",
        "slug": "rice",
        "image_url": "https://placehold.co/400x300?text=Rice",
    },
    {
        "name_ar": "الزيوت",
        "slug": "oils",
        "image_url": "https://placehold.co/400x300?text=Oil",
    },
    {
        "name_ar": "المنظفات",
        "slug": "cleaning",
        "image_url": "https://placehold.co/400x300?text=Cleaning",
    },
    {
        "name_ar": "المشروبات",
        "slug": "drinks",
        "image_url": "https://placehold.co/400x300?text=Drinks",
    },
]


products_data = [
    {
        "name_ar": "أرز بسمتي 5 كغم",
        "description_ar": "أرز بسمتي طويل الحبة بجودة ممتازة",
        "price": Decimal("32.5"),
        "category_slug": "rice",
        "image_url": "https://placehold.co/600x600?text=Rice",
        "is_available": True,
        "is_featured": True,
    },
    {
        "name_ar": "أرز مصري 5 كغم",
        "description_ar": "أرز مصري مناسب للطبخ اليومي",
        "price": Decimal("25.0"),
        "category_slug": "rice",
        "image_url": "https://placehold.co/600x600?text=Rice",
        "is_available": True,
        "is_featured": False,
    },
    {
        "name_ar": "زيت نباتي 1.5 لتر",
        "description_ar": "زيت نباتي مناسب للقلي والطبخ",
        "price": Decimal("18.5"),
        "category_slug": "oils",
        "image_url": "https://placehold.co/600x600?text=Oil",
        "is_available": True,
        "is_featured": True,
    },
    {
        "name_ar": "زيت دوار الشمس 3 لتر",
        "description_ar": "زيت دوار الشمس للاستخدام اليومي",
        "price": Decimal("31.0"),
        "category_slug": "oils",
        "image_url": "https://placehold.co/600x600?text=Oil",
        "is_available": False,
        "is_featured": False,
    },
    {
        "name_ar": "مسحوق غسيل 4 كغم",
        "description_ar": "مسحوق غسيل للملابس البيضاء والملونة",
        "price": Decimal("36.5"),
        "category_slug": "cleaning",
        "image_url": "https://placehold.co/600x600?text=Cleaning",
        "is_available": True,
        "is_featured": True,
    },
    {
        "name_ar": "مشروب غازي 2 لتر",
        "description_ar": "مشروب غازي بحجم عائلي",
        "price": Decimal("7.5"),
        "category_slug": "drinks",
        "image_url": "https://placehold.co/600x600?text=Drink",
        "is_available": True,
        "is_featured": True,
    },
]


def seed_database():
    db = SessionLocal()

    try:
        category_map: dict[str, Category] = {}

        for category_data in categories_data:
            category = db.scalar(
                select(Category).where(
                    Category.slug
                    == category_data["slug"]
                )
            )

            if category is None:
                category = Category(
                    **category_data
                )

                db.add(category)
                db.flush()

            category_map[
                category.slug
            ] = category

        for product_data in products_data:
            existing_product = db.scalar(
                select(Product).where(
                    Product.name_ar
                    == product_data["name_ar"]
                )
            )

            if existing_product:
                continue

            category_slug = product_data[
                "category_slug"
            ]

            category = category_map[
                category_slug
            ]

            product = Product(
                name_ar=product_data[
                    "name_ar"
                ],
                description_ar=product_data[
                    "description_ar"
                ],
                price=product_data[
                    "price"
                ],
                category_id=category.id,
                image_url=product_data[
                    "image_url"
                ],
                is_available=product_data[
                    "is_available"
                ],
                is_featured=product_data[
                    "is_featured"
                ],
                is_active=True,
            )

            db.add(product)

        db.commit()

        print(
            "Database seeded successfully."
        )

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()