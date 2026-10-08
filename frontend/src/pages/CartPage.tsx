import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import {
  useQuery,
} from '@tanstack/react-query'

import {
  useCart,
} from '../context/CartContext'

import {
  formatPrice,
} from '../utils/formatPrice'

import {
  getImageUrl,
  getStoreConfig,
} from '../services/api'


function CartPage() {
  const {
    items,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
    clearCart,
  } = useCart()


  const {
    data: storeConfig,
    isLoading: configLoading,
    isError: configError,
  } = useQuery({
    queryKey: [
      'store-config',
    ],

    queryFn:
      getStoreConfig,
  })


  const deliveryFee =
    Number(
      storeConfig?.delivery_fee ??
      0
    )


  const grandTotal =
    cartTotal +
    deliveryFee


  /*
    Empty cart
  */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream px-4 py-10">

        <div className="mx-auto max-w-xl rounded-[28px] border border-sand bg-card p-8 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-soft text-primary">

            <ShoppingBag
              size={28}
              strokeWidth={1.8}
            />

          </div>


          <h1 className="mt-5 text-xl font-bold text-ink">
            السلة فارغة
          </h1>


          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
            أضف المنتجات اللي بدك إياها، ورح تظهر هون مباشرة.
          </p>


          <Link
            to="/groups"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-6 text-sm font-bold text-white transition hover:bg-primary-dark"
          >
            ابدأ التسوق
          </Link>

        </div>

      </div>
    )
  }


  return (
    <div className="min-h-screen bg-cream">

      <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">

        {/* Header */}
        <div className="mb-6 flex items-end justify-between gap-4">

          <div>

            <p className="text-xs font-medium text-muted-light">
              راجع طلبك
            </p>

            <h1 className="mt-1 text-2xl font-bold text-ink">
              سلة التسوق
            </h1>

            <p className="mt-1 text-sm text-muted">
              عدّل الكميات قبل إتمام الطلب
            </p>

          </div>


          <button
            type="button"
            onClick={clearCart}
            className="shrink-0 text-xs font-bold text-muted transition hover:text-ink"
          >
            تفريغ السلة
          </button>

        </div>


        {/* Items */}
        <div className="space-y-3">

          {items.map(
            (item) => {

              const imageUrl =
                getImageUrl(
                  item.product.image
                )


              return (
                <article
                  key={
                    item.product.id
                  }
                  className="rounded-[22px] border border-sand bg-card p-3 sm:p-4"
                >

                  <div className="flex gap-3 sm:gap-4">

                    {/* Image */}
                    <Link
                      to={`/products/${item.product.id}`}
                      className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-soft sm:h-28 sm:w-28"
                    >

                      <img
                        src={
                          imageUrl ??
                          'https://placehold.co/300x300?text=Product'
                        }
                        alt={
                          item.product.name_ar
                        }
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src =
                            'https://placehold.co/300x300?text=Product'
                        }}
                      />

                    </Link>


                    {/* Info */}
                    <div className="flex min-w-0 flex-1 flex-col">

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <Link
                            to={`/products/${item.product.id}`}
                            className="block"
                          >

                            <h2 className="line-clamp-2 text-sm font-bold leading-6 text-ink transition hover:text-primary">
                              {
                                item.product.name_ar
                              }
                            </h2>

                          </Link>


                          <p className="mt-1 text-sm font-bold text-primary">

                            {formatPrice(
                              item.product.price
                            )}

                          </p>

                        </div>


                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(
                              item.product.id
                            )
                          }
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted-light transition hover:bg-soft hover:text-ink"
                          aria-label="حذف المنتج"
                        >

                          <Trash2
                            size={17}
                          />

                        </button>

                      </div>


                      <div className="mt-auto flex items-end justify-between gap-3 pt-3">

                        {/* Quantity */}
                        <div className="flex h-10 items-center rounded-xl border border-sand bg-cream p-1">

                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                item.product.id
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-primary transition hover:bg-soft"
                            aria-label="تقليل الكمية"
                          >

                            <Minus
                              size={16}
                            />

                          </button>


                          <span className="min-w-9 text-center text-sm font-bold text-ink">
                            {item.quantity}
                          </span>


                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(
                                item.product.id
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white transition hover:bg-primary-dark"
                            aria-label="زيادة الكمية"
                          >

                            <Plus
                              size={16}
                            />

                          </button>

                        </div>


                        {/* Line total */}
                        <div className="text-left">

                          <p className="text-[10px] text-muted-light">
                            المجموع
                          </p>

                          <p className="mt-0.5 text-sm font-bold text-ink">

                            {formatPrice(
                              Number(
                                item.product.price
                              ) *
                                item.quantity
                            )}

                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </article>
              )
            }
          )}

        </div>


        {/* Continue shopping */}
        <Link
          to="/groups"
          className="mt-4 inline-flex text-sm font-bold text-primary transition hover:text-primary-dark"
        >
          + إضافة منتجات أخرى
        </Link>


        {/* Summary */}
        <section className="mt-7 overflow-hidden rounded-[26px] border border-sand bg-card">

          <div className="p-5 sm:p-6">

            <h2 className="text-lg font-bold text-ink">
              ملخص الطلب
            </h2>


            <div className="mt-5 space-y-4">

              {/* Products */}
              <div className="flex items-center justify-between gap-4">

                <span className="text-sm text-muted">
                  قيمة المنتجات
                </span>

                <span className="text-sm font-bold text-ink">
                  {formatPrice(
                    cartTotal
                  )}
                </span>

              </div>


              {/* Delivery */}
              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-2 text-sm text-muted">

                  <Truck
                    size={16}
                    className="text-primary"
                  />

                  رسوم التوصيل

                </div>


                <span className="text-sm font-bold text-ink">

                  {configLoading
                    ? '...'
                    : configError
                      ? 'غير متاح'
                      : formatPrice(
                          deliveryFee
                        )}

                </span>

              </div>

            </div>


            {/* Grand total */}
            <div className="mt-5 border-t border-sand pt-5">

              <div className="flex items-end justify-between gap-4">

                <div>

                  <p className="font-bold text-ink">
                    المبلغ عند الاستلام
                  </p>

                  <p className="mt-1 text-xs text-muted-light">
                    الدفع نقداً عند استلام الطلب
                  </p>

                </div>


                <span className="shrink-0 text-2xl font-bold text-primary">

                  {configLoading
                    ? '...'
                    : configError
                      ? '—'
                      : formatPrice(
                          grandTotal
                        )}

                </span>

              </div>

            </div>


            {/* Config error */}
            {configError && (

              <div className="mt-4 rounded-xl bg-soft px-4 py-3 text-xs leading-5 text-muted">
                تعذر تحميل رسوم التوصيل. حاول تحديث الصفحة قبل إتمام الطلب.
              </div>

            )}


            {/* Checkout */}
            <Link
              to={
                configError ||
                configLoading
                  ? '#'
                  : '/checkout'
              }
              onClick={(event) => {
                if (
                  configError ||
                  configLoading
                ) {
                  event.preventDefault()
                }
              }}
              className={`mt-6 flex h-12 w-full items-center justify-center rounded-2xl text-sm font-bold transition ${
                configError ||
                configLoading
                  ? 'cursor-not-allowed bg-soft text-muted-light'
                  : 'bg-primary text-white shadow-sm hover:bg-primary-dark hover:shadow-md'
              }`}
            >
              متابعة لإتمام الطلب
            </Link>

          </div>

        </section>

      </div>

    </div>
  )
}


export default CartPage