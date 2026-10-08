from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class CategoryVisibilityUpdate(BaseModel):
    is_active: bool


class CategoryResponse(BaseModel):
    id: int

    name_ar: str

    slug: str

    image: str | None = Field(
        default=None,
        validation_alias="image_url",
    )

    is_active: bool

    model_config = ConfigDict(
        from_attributes=True
    )