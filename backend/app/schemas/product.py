from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class ProductCreate(BaseModel):
    name_ar: str

    description_ar: str | None = None

    price: float = Field(
        gt=0
    )

    category_id: int

    is_available: bool = True

    is_featured: bool = False


class ProductAvailabilityUpdate(BaseModel):
    is_available: bool


class ProductVisibilityUpdate(BaseModel):
    is_active: bool


class ProductResponse(BaseModel):
    id: int

    name_ar: str

    description_ar: str | None

    price: float

    category_id: int

    image: str | None = Field(
        default=None,
        validation_alias="image_url",
    )

    is_available: bool

    is_featured: bool

    is_active: bool

    model_config = ConfigDict(
        from_attributes=True
    )