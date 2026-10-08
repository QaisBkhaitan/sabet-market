from sqlalchemy import select

from app.core.config import settings
from app.core.security import hash_password
from app.db.database import SessionLocal
from app.models.admin import Admin


def seed_admin():
    db = SessionLocal()

    try:
        existing_admin = db.scalar(
            select(Admin).where(
                Admin.username
                == settings.admin_username
            )
        )

        if existing_admin:
            print(
                "Admin already exists."
            )
            return

        admin = Admin(
            username=
            settings.admin_username,

            password_hash=
            hash_password(
                settings.admin_password
            ),

            is_active=True,
        )

        db.add(admin)
        db.commit()

        print(
            "Admin created successfully."
        )

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_admin()