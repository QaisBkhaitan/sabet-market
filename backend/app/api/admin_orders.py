from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy import select
from sqlalchemy.orm import (
    Session,
    selectinload,
)

from app.api.admin_auth import (
    get_current_admin,
)

from app.db.database import get_db

from app.models.admin import Admin
from app.models.order import Order

from app.schemas.admin_order import (
    AdminOrderResponse,
    AdminOrderStatusUpdate,
)


router = APIRouter(
    prefix="/api/admin/orders",
    tags=["Admin Orders"],
)


# =========================
# GET ALL ORDERS
# =========================

@router.get(
    "",
    response_model=list[
        AdminOrderResponse
    ],
)
def admin_get_orders(
    db: Session = Depends(get_db),

    admin: Admin = Depends(
        get_current_admin
    ),
):
    orders = db.scalars(
        select(Order)
        .options(
            selectinload(
                Order.items
            )
        )
        .order_by(
            Order.id.desc()
        )
    ).all()

    return orders


# =========================
# UPDATE ORDER STATUS
# =========================

@router.patch(
    "/{order_id}/status",
    response_model=AdminOrderResponse,
)
def admin_update_order_status(
    order_id: int,

    data: AdminOrderStatusUpdate,

    db: Session = Depends(get_db),

    admin: Admin = Depends(
        get_current_admin
    ),
):
    order = db.scalar(
        select(Order)
        .options(
            selectinload(
                Order.items
            )
        )
        .where(
            Order.id == order_id
        )
    )


    if order is None:
        raise HTTPException(
            status_code=404,
            detail="الطلب غير موجود",
        )


    order.status = (
        data.status
    )


    db.commit()
    db.refresh(order)


    return order