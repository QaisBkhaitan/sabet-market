from logging.config import fileConfig

from alembic import context
from sqlalchemy import (
    engine_from_config,
    pool,
)

from app.core.config import settings
from app.db.database import Base

# Import all models so Alembic knows
# about the complete database schema.
from app.models.admin import Admin
from app.models.category import Category
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product


config = context.config


# Alembic uses ConfigParser internally.
# Escape % characters in case they appear
# inside the production database password.
database_url = (
    settings.database_url
    .replace("%", "%%")
)


config.set_main_option(
    "sqlalchemy.url",
    database_url,
)


if config.config_file_name is not None:
    fileConfig(
        config.config_file_name
    )


target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option(
        "sqlalchemy.url"
    )

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={
            "paramstyle": "named",
        },
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(
            config.config_ini_section,
            {}
        ),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()