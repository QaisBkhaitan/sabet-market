import logging

from io import BytesIO
from uuid import uuid4

import cloudinary
import cloudinary.uploader

from fastapi import (
    HTTPException,
    UploadFile,
)

from PIL import (
    Image,
    ImageOps,
)

from pillow_heif import (
    register_heif_opener,
)

from app.core.config import settings


logger = logging.getLogger(
    __name__
)


register_heif_opener()


cloudinary.config(
    cloud_name=
        settings.cloudinary_cloud_name,

    api_key=
        settings.cloudinary_api_key,

    api_secret=
        settings.cloudinary_api_secret,

    secure=True,
)


MAX_FILE_SIZE = (
    10 * 1024 * 1024
)

MAX_IMAGE_PIXELS = (
    40_000_000
)

MAX_IMAGE_SIZE = (
    1400,
    1400,
)


async def upload_image(
    uploaded_file: UploadFile,
    folder: str,
) -> tuple[str, str]:
    """
    Validate and process an uploaded image,
    then upload it to Cloudinary.

    Returns:
        (secure_url, public_id)
    """

    file_bytes = (
        await uploaded_file.read(
            MAX_FILE_SIZE + 1
        )
    )


    if not file_bytes:
        raise HTTPException(
            status_code=400,
            detail="ملف الصورة فارغ",
        )


    if (
        len(file_bytes)
        > MAX_FILE_SIZE
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "حجم الصورة أكبر "
                "من المسموح"
            ),
        )


    try:
        image = Image.open(
            BytesIO(
                file_bytes
            )
        )

        image.load()

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=(
                "ملف الصورة غير صالح"
            ),
        ) from exc


    if (
        image.width
        * image.height
        > MAX_IMAGE_PIXELS
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "أبعاد الصورة كبيرة جداً"
            ),
        )

    # تصحيح اتجاه صور الهاتف
    # اعتماداً على EXIF.
    image = ImageOps.exif_transpose(
        image
    )


    # تصغير الصورة مع الحفاظ
    # على النسبة الأصلية.
    image.thumbnail(
        MAX_IMAGE_SIZE,
        Image.Resampling.LANCZOS,
    )


    if "A" in image.getbands():
        image = image.convert(
            "RGBA"
        )
    else:
        image = image.convert(
            "RGB"
        )


    output_buffer = BytesIO()


    image.save(
        output_buffer,
        format="WEBP",
        quality=85,
        method=6,
    )


    output_buffer.seek(0)


    public_id = (
        f"sabet-market/"
        f"{folder}/"
        f"{uuid4().hex}"
    )


    try:
        result = (
            cloudinary.uploader.upload(
                output_buffer,

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

    except Exception as exc:
        logger.exception(
            "Cloudinary image upload failed"
        )

        raise HTTPException(
            status_code=502,
            detail=(
                "تعذر رفع الصورة، "
                "حاول مرة أخرى"
            ),
        ) from exc


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
        raise HTTPException(
            status_code=502,
            detail=(
                "لم يتم استلام رابط "
                "الصورة بشكل صحيح"
            ),
        )


    return (
        secure_url,
        saved_public_id,
    )


def delete_image(
    public_id: str | None,
) -> None:
    """
    Delete an image from Cloudinary.

    Failure to delete an old image should
    not break an already successful DB
    update.
    """

    if not public_id:
        return


    try:
        cloudinary.uploader.destroy(
            public_id,

            resource_type=
                "image",

            invalidate=True,
        )

    except Exception:
        logger.exception(
            "Could not delete Cloudinary image: %s",
            public_id,
        )