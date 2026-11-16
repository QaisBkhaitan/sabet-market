"""Product/category image storage, with safe staged Cloudinary -> ImageKit migration.

Existing Cloudinary image IDs remain untouched when ImageKit is enabled.
New ImageKit IDs have the 'imagekit:' prefix for safe deletion routing.
"""

import logging
from io import BytesIO
from uuid import uuid4

import cloudinary
import cloudinary.uploader
from fastapi import HTTPException, UploadFile
from imagekitio import AsyncImageKit, ImageKit
from PIL import Image, ImageOps
from pillow_heif import register_heif_opener

from app.core.config import settings

logger = logging.getLogger(__name__)
register_heif_opener()

cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
    secure=True,
)

MAX_FILE_SIZE = 10 * 1024 * 1024
MAX_IMAGE_PIXELS = 40_000_000
MAX_IMAGE_SIZE = (1400, 1400)
IMAGEKIT_PREFIX = "imagekit:"


def _imagekit_key() -> str:
    key = (settings.imagekit_private_key or "").strip()
    if not key:
        logger.error("ImageKit private key is not configured")
        raise HTTPException(
            status_code=503,
            detail="خدمة رفع الصور غير مهيأة حالياً",
        )
    return key


async def upload_image(
    uploaded_file: UploadFile,
    folder: str,
) -> tuple[str, str]:
    """Validate, resize and convert to WEBP; return (URL, provider-aware ID)."""
    if folder not in {"products", "categories"}:
        raise HTTPException(status_code=400, detail="مجلد الصور غير صالح")

    file_bytes = await uploaded_file.read(MAX_FILE_SIZE + 1)
    if not file_bytes:
        raise HTTPException(status_code=400, detail="ملف الصورة فارغ")
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="حجم الصورة أكبر من المسموح")

    try:
        image = Image.open(BytesIO(file_bytes))
        # Validate declared dimensions before fully decoding the image.
        if image.width * image.height > MAX_IMAGE_PIXELS:
            raise HTTPException(status_code=400, detail="أبعاد الصورة كبيرة جداً")
        image.load()
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail="ملف الصورة غير صالح") from exc

    image = ImageOps.exif_transpose(image)
    image.thumbnail(MAX_IMAGE_SIZE, Image.Resampling.LANCZOS)
    image = image.convert("RGBA" if "A" in image.getbands() else "RGB")

    output_buffer = BytesIO()
    image.save(output_buffer, format="WEBP", quality=85, method=6)
    output_buffer.seek(0)

    if settings.image_storage_provider == "imagekit":
        key = _imagekit_key()
        file_name = f"{uuid4().hex}.webp"
        try:
            async with AsyncImageKit(private_key=key) as client:
                result = await client.files.upload(
                    file=output_buffer.getvalue(),
                    file_name=file_name,
                    folder=f"/sabet-market/{folder}",
                )
        except Exception as exc:
            logger.exception("ImageKit image upload failed")
            raise HTTPException(
                status_code=502,
                detail="تعذر رفع الصورة، حاول مرة أخرى",
            ) from exc

        if not result.url or not result.file_id:
            raise HTTPException(
                status_code=502,
                detail="لم يتم استلام رابط الصورة بشكل صحيح",
            )
        return (result.url, f"{IMAGEKIT_PREFIX}{result.file_id}")

    # Keep old upload behavior available until ImageKit has been tested.
    public_id = f"sabet-market/{folder}/{uuid4().hex}"
    try:
        result = cloudinary.uploader.upload(
            output_buffer,
            public_id=public_id,
            resource_type="image",
            format="webp",
            overwrite=False,
        )
    except Exception as exc:
        logger.exception("Cloudinary image upload failed")
        raise HTTPException(
            status_code=502,
            detail="تعذر رفع الصورة، حاول مرة أخرى",
        ) from exc

    secure_url = result.get("secure_url")
    saved_public_id = result.get("public_id")
    if not secure_url or not saved_public_id:
        raise HTTPException(
            status_code=502,
            detail="لم يتم استلام رابط الصورة بشكل صحيح",
        )
    return (secure_url, saved_public_id)


def delete_image(public_id: str | None) -> None:
    """Best-effort deletion; never delete legacy Cloudinary assets under ImageKit."""
    if not public_id:
        return

    if public_id.startswith(IMAGEKIT_PREFIX):
        file_id = public_id[len(IMAGEKIT_PREFIX):]
        if not file_id:
            return
        try:
            with ImageKit(private_key=_imagekit_key()) as client:
                client.files.delete(file_id=file_id)
        except Exception:
            logger.exception("Could not delete ImageKit image")
        return

    if settings.image_storage_provider != "cloudinary":
        # Legacy Cloudinary image: leave it untouched for recovery.
        return

    try:
        cloudinary.uploader.destroy(
            public_id,
            resource_type="image",
            invalidate=True,
        )
    except Exception:
        logger.exception("Could not delete legacy Cloudinary image")
