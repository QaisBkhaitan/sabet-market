import {
  CheckCircle2,
  Home,
  MessageCircle,
  PackageCheck,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import type {
  OrderResponse,
} from '../services/api'

import {
  formatPrice,
} from '../utils/formatPrice'


function OrderSuccessPage() {
  const storedOrder =
    sessionStorage.getItem(
      'last-order'
    )


  let order:
    OrderResponse | null = null


  if (storedOrder) {
    try {
      order =
        JSON.parse(
          storedOrder
        ) as OrderResponse
    } catch {
      order = null
    }
  }


  /*
    نضيف رقم واتساب المتجر لاحقاً داخل:
    frontend/.env

    VITE_STORE_WHATSAPP=972XXXXXXXXX

    بدون + وبدون مسافات.
  */
  const storeWhatsapp =
    import.meta.env
      .VITE_STORE_WHATSAPP
      ?.trim()


  const whatsappUrl =
    storeWhatsapp
      ? `https://wa.me/${storeWhatsapp}`
      : null


  return (
    <div className="min-h-screen bg-cream">

      <div className="mx-auto max-w-xl px-4 py-8 sm:py-12">

        <section className="overflow-hidden rounded-[30px] border border-sand bg-card">

          {/* Success */}
          <div className="px-6 pb-6 pt-8 text-center sm:px-8">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#EEF1EA] text-primary">

              <CheckCircle2
                size={42}
                strokeWidth={1.8}
              />

            </div>


            <h1 className="mt-5 text-2xl font-bold text-ink">
              تم استلام طلبك بنجاح
            </h1>


            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted">
              شكراً لاختيارك السَبت ماركت.
              رح نتواصل معك لتأكيد الطلب
              وترتيب التوصيل.
            </p>

          </div>


          {order && (

            <>
              {/* Order Number */}
              <div className="mx-5 rounded-2xl border border-sand bg-cream p-4 text-center sm:mx-6">

                <p className="text-xs text-muted">
                  رقم الطلب
                </p>

                <p
                  dir="ltr"
                  className="mt-1 text-xl font-bold tracking-wide text-primary"
                >
                  {order.order_number}
                </p>

                <p className="mt-2 text-[11px] text-muted-light">
                  احتفظ برقم الطلب في حال احتجت للتواصل معنا
                </p>

              </div>


              {/* Total */}
              <div className="mx-5 mt-5 rounded-2xl bg-soft p-5 sm:mx-6">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <p className="text-xs text-muted">
                      المبلغ عند الاستلام
                    </p>

                    <p className="mt-1 text-[11px] text-muted-light">
                      الدفع نقداً عند استلام الطلب
                    </p>

                  </div>


                  <span className="shrink-0 text-2xl font-bold text-primary">

                    {formatPrice(
                      order.grand_total
                    )}

                  </span>

                </div>

              </div>


              {/* Price Details */}
              <div className="mx-5 mt-4 space-y-3 px-1 sm:mx-6">

                <div className="flex items-center justify-between text-sm">

                  <span className="text-muted">
                    قيمة المنتجات
                  </span>

                  <span className="font-bold text-ink">

                    {formatPrice(
                      order.total_amount
                    )}

                  </span>

                </div>


                <div className="flex items-center justify-between text-sm">

                  <span className="text-muted">
                    رسوم التوصيل
                  </span>

                  <span className="font-bold text-ink">

                    {formatPrice(
                      order.delivery_fee
                    )}

                  </span>

                </div>

              </div>


              {/* Products */}
              {order.items.length > 0 && (

                <div className="mx-5 mt-6 border-t border-sand pt-5 sm:mx-6">

                  <div className="mb-4 flex items-center gap-2">

                    <PackageCheck
                      size={18}
                      className="text-primary"
                    />

                    <h2 className="font-bold text-ink">
                      طلبك
                    </h2>

                  </div>


                  <div className="space-y-3">

                    {order.items.map(
                      (item) => (

                        <div
                          key={
                            item.product_id
                          }
                          className="flex items-center justify-between gap-4 rounded-xl bg-cream px-3 py-3"
                        >

                          <div className="min-w-0">

                            <p className="line-clamp-1 text-sm font-bold text-ink">
                              {
                                item.product_name
                              }
                            </p>

                            <p className="mt-1 text-xs text-muted">
                              الكمية{' '}
                              {
                                item.quantity
                              }
                            </p>

                          </div>


                          <span className="shrink-0 text-sm font-bold text-primary">

                            {formatPrice(
                              item.line_total
                            )}

                          </span>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

            </>

          )}


          {/* Actions */}
          <div className="mt-6 border-t border-sand p-5 sm:p-6">

            <div className="space-y-3">

              {whatsappUrl && (

                <a
                  href={
                    whatsappUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-white transition hover:bg-primary-dark"
                >

                  <MessageCircle
                    size={18}
                  />

                  تواصل معنا عبر واتساب

                </a>

              )}


              <Link
                to="/"
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold transition ${
                  whatsappUrl
                    ? 'border border-sand bg-cream text-primary hover:bg-soft'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >

                <Home
                  size={18}
                />

                العودة للرئيسية

              </Link>

            </div>

          </div>

        </section>

      </div>

    </div>
  )
}


export default OrderSuccessPage