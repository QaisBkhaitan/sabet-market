from decimal import Decimal
from uuid import uuid4

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.database import get_db

from app.models.category import Category
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product

from app.schemas.order import (
    OrderCreate,
    OrderItemResponse,
    OrderResponse,
)


router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"],
)


def generate_order_number() -> str:
    return (
        "SJ-"
        + uuid4().hex[:8].upper()
    )


@router.post(
    "",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_order(
    data: OrderCreate,
    db: Session = Depends(get_db),
):

    customer_name = (
        data.customer_name.strip()
    )

    phone = (
        data.phone.strip()
    )

    whatsapp = (
        data.whatsapp.strip()
    )

    city = (
        data.city.strip()
    )

    address = (
        data.address.strip()
    )


    if not customer_name:
        raise HTTPException(
            status_code=400,
            detail="اسم الزبون مطلوب",
        )


    if not phone:
        raise HTTPException(
            status_code=400,
            detail="رقم الهاتف مطلوب",
        )


    if not whatsapp:
        raise HTTPException(
            status_code=400,
            detail=(
                "رقم الواتساب مطلوب "
                "للتواصل وتأكيد الطلب"
            ),
        )


    if not city:
        raise HTTPException(
            status_code=400,
            detail="المدينة مطلوبة",
        )


    if not address:
        raise HTTPException(
            status_code=400,
            detail="العنوان مطلوب",
        )


    total_amount = Decimal(
        "0.0"
    )


    validated_items: list[
        tuple[
            Product,
            int,
            Decimal,
        ]
    ] = []


    for requested_item in data.items:

        product = db.scalar(
            select(Product)
            .join(
                Category,
                Product.category_id
                == Category.id,
            )
            .where(
                Product.id
                == requested_item.product_id,

                Product.is_active
                .is_(True),

                Category.is_active
                .is_(True),
            )
        )


        if product is None:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"المنتج رقم "
                    f"{requested_item.product_id} "
                    f"غير موجود أو غير متاح"
                ),
            )


        if not product.is_available:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"المنتج "
                    f"{product.name_ar} "
                    f"غير متوفر حالياً"
                ),
            )


        quantity = (
            requested_item.quantity
        )


        unit_price = Decimal(
            str(product.price)
        )


        line_total = (
            unit_price
            * quantity
        )


        total_amount += (
            line_total
        )


        validated_items.append(
            (
                product,
                quantity,
                line_total,
            )
        )


    delivery_fee = Decimal(
        str(
            settings.delivery_fee
        )
    )


    grand_total = (
        total_amount
        + delivery_fee
    )

    order = Order(
        order_number=
            generate_order_number(),

        customer_name=
            customer_name,

        phone=
            phone,

        whatsapp=
            whatsapp,

        city=
            city,

        address=
            address,

        latitude=
            data.latitude,

        longitude=
            data.longitude,

        notes=(
            data.notes.strip()
            if data.notes
            and data.notes.strip()
            else None
        ),

        total_amount=
            total_amount,

        delivery_fee=
            delivery_fee,

        grand_total=
            grand_total,

        payment_method=
            "cash_on_delivery",

        status=
            "new",
    )


    try:
        db.add(
            order
        )

        db.flush()


        response_items = []


        for (
            product,
            quantity,
            line_total,
        ) in validated_items:

            unit_price = Decimal(
                str(
                    product.price
                )
            )


            order_item = OrderItem(
                order_id=
                    order.id,

                product_id=
                    product.id,

                product_name=
                    product.name_ar,

                unit_price=
                    unit_price,

                quantity=
                    quantity,

                line_total=
                    line_total,
            )


            db.add(
                order_item
            )


            response_items.append(
                OrderItemResponse(
                    product_id=
                        product.id,

                    product_name=
                        product.name_ar,

                    unit_price=
                        unit_price,

                    quantity=
                        quantity,

                    line_total=
                        line_total,
                )
            )


        db.commit()

        db.refresh(
            order
        )


        return OrderResponse(
            id=
                order.id,

            order_number=
                order.order_number,

            customer_name=
                order.customer_name,

            phone=
                order.phone,

            whatsapp=
                order.whatsapp,

            city=
                order.city,

            address=
                order.address,

            latitude=
                order.latitude,

            longitude=
                order.longitude,

            notes=
                order.notes,

            total_amount=
                order.total_amount,

            delivery_fee=
                order.delivery_fee,

            grand_total=
                order.grand_total,

            payment_method=
                order.payment_method,

            status=
                order.status,

            items=
                response_items,
        )


    except Exception:
        db.rollback()
        raise