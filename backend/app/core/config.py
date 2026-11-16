from decimal import Decimal
from typing import Literal

from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict,
)


class Settings(BaseSettings):
    database_url: str

    admin_username: str
    admin_password: str

    secret_key: str

    access_token_expire_minutes: int = 1440

    delivery_fee: Decimal = Decimal("0.0")

    # Application environment
    environment: str = "development"

    # Frontend origin used for CORS
    frontend_url: str = "http://localhost:5173"

    # Keep existing Cloudinary settings during the migration.
    cloudinary_cloud_name: str
    cloudinary_api_key: str
    cloudinary_api_secret: str

    # Default stays Cloudinary until explicitly enabled on Railway.
    image_storage_provider: Literal["cloudinary", "imagekit"] = "cloudinary"
    imagekit_private_key: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

    @property
    def is_production(self) -> bool:
        return self.environment.strip().lower() == "production"


settings = Settings()
