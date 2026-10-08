import {
  useState,
} from 'react'

import {
  ArrowRight,
  CalendarDays,
  MapPin,
  MessageCircle,
  Navigation,
  Package,
  Phone,
  ShoppingBag,
  User,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  adminGetOrders,
  adminUpdateOrderStatus,
  type AdminOrderStatus,
} from '../../services/api'

import {
  formatPrice,
} from '../../utils/formatPrice'


type OrderFilter =
  | 'all'
  | AdminOrderStatus


const statusLabels: Record<
  AdminOrderStatus,
  string
> = {
  new: 'جديد',
  confirmed: 'تم التأكيد',
  delivered: 'تم التوصيل',
  cancelled: 'ملغي',
}


function AdminOrdersPage() {
  const queryClient =
    useQueryClient()


  const [
    statusFilter,
    setStatusFilter,
  ] = useState<OrderFilter>(
    'all'
  )


  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      'admin-orders',
    ],

    queryFn:
      adminGetOrders,
  })


  const statusMutation =
    useMutation({
      mutationFn: ({
        orderId,
        newStatus,
      }: {
        orderId: number
        newStatus: AdminOrderStatus
      }) =>
        adminUpdateOrderStatus(
          orderId,
          newStatus
        ),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            'admin-orders',
          ],
        })
      },
    })


  /*
    عدد الطلبات حسب الحالة.
  */
  const allCount =
    orders.length


  const newCount =
    orders.filter(
      (order) =>
        order.status === 'new'
    ).length


  const confirmedCount =
    orders.filter(
      (order) =>
        order.status ===
        'confirmed'
    ).length


  const deliveredCount =
    orders.filter(
      (order) =>
        order.status ===
        'delivered'
    ).length


  const cancelledCount =
    orders.filter(
      (order) =>
        order.status ===
        'cancelled'
    ).length


  /*
    الطلبات التي ستظهر حسب الفلتر.
  */
  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter(
          (order) =>
            order.status ===
            statusFilter
        )


  function formatDate(
    date: string
  ) {
    const parsedDate =
      new Date(date)

    return parsedDate.toLocaleString(
      'ar',
      {
        dateStyle:
          'medium',

        timeStyle:
          'short',
      }
    )
  }


  function handleStatusChange(
    orderId: number,
    value: string
  ) {
    const newStatus =
      value as AdminOrderStatus

    statusMutation.mutate({
      orderId,
      newStatus,
    })
  }


  /*
    WhatsApp يحتاج الرقم
    بدون + أو مسافات.
  */
  function getWhatsAppUrl(
    number: string
  ) {
    const cleanNumber =
      number.replace(
        /\D/g,
        ''
      )

    return (
      `https://wa.me/${cleanNumber}`
    )
  }


  function getStatusBadgeClass(
    status: AdminOrderStatus
  ) {
    switch (status) {
      case 'new':
        return (
          'bg-amber-50 text-amber-700'
        )

      case 'confirmed':
        return (
          'bg-blue-50 text-blue-700'
        )

      case 'delivered':
        return (
          'bg-green-50 text-green-700'
        )

      case 'cancelled':
        return (
          'bg-red-50 text-red-700'
        )

      default:
        return (
          'bg-cream text-coffee-dark'
        )
    }
  }


  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
      <header className="border-b border-sand bg-card">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

          <div>

            <h1 className="font-bold text-ink">
              إدارة الطلبات
            </h1>

            <p className="text-xs text-coffee">
              السَبت ماركت
            </p>

          </div>


          <Link
            to="/admin"
            className="flex items-center gap-2 rounded-xl border border-sand px-3 py-2 text-sm text-coffee-dark transition hover:bg-cream"
          >

            <ArrowRight
              size={17}
            />

            لوحة الإدارة

          </Link>

        </div>

      </header>


      <main className="mx-auto max-w-5xl px-4 py-6">

        {/* Title */}
        <div>

          <h2 className="text-2xl font-bold text-ink">
            الطلبات
          </h2>

          <p className="mt-1 text-sm text-coffee">
            عرض وإدارة طلبات الزبائن
          </p>

        </div>


        {/* Filters */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2">

          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                'all'
              )
            }
            className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-bold transition ${
              statusFilter === 'all'
                ? 'border-coffee-dark bg-coffee-dark text-white'
                : 'border-sand bg-card text-coffee-dark'
            }`}
          >
            الكل ({allCount})
          </button>


          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                'new'
              )
            }
            className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-bold transition ${
              statusFilter === 'new'
                ? 'border-coffee-dark bg-coffee-dark text-white'
                : 'border-sand bg-card text-coffee-dark'
            }`}
          >
            جديد ({newCount})
          </button>


          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                'confirmed'
              )
            }
            className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-bold transition ${
              statusFilter ===
              'confirmed'
                ? 'border-coffee-dark bg-coffee-dark text-white'
                : 'border-sand bg-card text-coffee-dark'
            }`}
          >
            تم التأكيد ({confirmedCount})
          </button>


          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                'delivered'
              )
            }
            className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-bold transition ${
              statusFilter ===
              'delivered'
                ? 'border-coffee-dark bg-coffee-dark text-white'
                : 'border-sand bg-card text-coffee-dark'
            }`}
          >
            تم التوصيل ({deliveredCount})
          </button>


          <button
            type="button"
            onClick={() =>
              setStatusFilter(
                'cancelled'
              )
            }
            className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-bold transition ${
              statusFilter ===
              'cancelled'
                ? 'border-coffee-dark bg-coffee-dark text-white'
                : 'border-sand bg-card text-coffee-dark'
            }`}
          >
            ملغي ({cancelledCount})
          </button>

        </div>


        {/* Loading */}
        {isLoading && (

          <div className="py-14 text-center text-sm text-coffee">
            جاري تحميل الطلبات...
          </div>

        )}


        {/* Error */}
        {isError && (

          <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            حدث خطأ أثناء تحميل الطلبات
          </div>

        )}


        {/* Empty */}
        {!isLoading &&
          !isError &&
          filteredOrders.length === 0 && (

            <div className="mt-7 rounded-3xl border border-sand bg-card p-10 text-center">

              <ShoppingBag
                size={34}
                className="mx-auto text-coffee"
              />

              <p className="mt-3 text-sm text-coffee">
                لا توجد طلبات في هذه الحالة
              </p>

            </div>

          )}


        {/* Orders */}
        <div className="mt-7 space-y-5">

          {filteredOrders.map(
            (order) => {

              const isUpdating =
                statusMutation.isPending &&
                statusMutation.variables
                  ?.orderId ===
                  order.id


              const contactNumber =
                order.whatsapp ||
                order.phone


              return (
                <article
                  key={order.id}
                  className={`overflow-hidden rounded-3xl border bg-card ${
                    order.status === 'new'
                      ? 'border-coffee'
                      : 'border-sand'
                  }`}
                >

                  {/* Order Header */}
                  <div className="border-b border-sand p-5">

                    <div className="flex flex-wrap items-start justify-between gap-4">

                      <div>

                        <p className="text-xs text-coffee">
                          رقم الطلب
                        </p>

                        <p
                          dir="ltr"
                          className="mt-1 text-lg font-bold text-coffee-dark"
                        >
                          {
                            order.order_number
                          }
                        </p>

                      </div>


                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >

                        {
                          statusLabels[
                            order.status
                          ]
                        }

                      </span>

                    </div>


                    <div className="mt-3 flex items-center gap-2 text-xs text-coffee">

                      <CalendarDays
                        size={15}
                      />

                      {formatDate(
                        order.created_at
                      )}

                    </div>

                  </div>


                  {/* Customer */}
                  <div className="grid gap-5 border-b border-sand p-5 md:grid-cols-2">

                    <div>

                      <div className="flex items-center gap-2 text-sm font-bold text-ink">

                        <User
                          size={17}
                        />

                        {
                          order.customer_name
                        }

                      </div>


                      <a
                        href={`tel:${order.phone}`}
                        dir="ltr"
                        className="mt-3 flex w-fit items-center gap-2 text-sm text-coffee-dark"
                      >

                        <Phone
                          size={16}
                        />

                        {
                          order.phone
                        }

                      </a>


                      {order.whatsapp && (

                        <p
                          dir="ltr"
                          className="mt-2 text-right text-xs text-coffee"
                        >
                          WhatsApp:{' '}
                          {
                            order.whatsapp
                          }
                        </p>

                      )}


                      {/* Contact buttons */}
                      <div className="mt-4 flex flex-wrap gap-2">

                        <a
                          href={`tel:${order.phone}`}
                          className="flex h-10 items-center justify-center gap-2 rounded-xl border border-sand bg-cream px-4 text-xs font-bold text-coffee-dark"
                        >

                          <Phone
                            size={15}
                          />

                          اتصال

                        </a>


                        <a
                          href={
                            getWhatsAppUrl(
                              contactNumber
                            )
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-coffee-dark px-4 text-xs font-bold text-white transition hover:bg-ink"
                        >

                          <MessageCircle
                            size={15}
                          />

                          واتساب

                        </a>

                      </div>

                    </div>


                    {/* Address */}
                    <div>

                      <div className="flex items-start gap-2">

                        <MapPin
                          size={17}
                          className="mt-0.5 shrink-0 text-coffee"
                        />

                        <div>

                          <p className="text-sm font-bold text-ink">
                            {order.city}
                          </p>

                          <p className="mt-1 text-sm leading-6 text-coffee">
                            {
                              order.address
                            }
                          </p>

                        </div>

                      </div>


                      {order.latitude !== null &&
                        order.longitude !== null && (

                          <a
                            href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 flex w-fit items-center gap-2 rounded-xl border border-sand bg-cream px-3 py-2 text-xs font-bold text-coffee-dark"
                          >

                            <Navigation
                              size={15}
                            />

                            فتح الموقع على الخريطة

                          </a>

                        )}

                    </div>

                  </div>


                  {/* Notes */}
                  {order.notes && (

                    <div className="border-b border-sand bg-cream/40 p-5">

                      <p className="text-xs font-bold text-coffee-dark">
                        ملاحظات الزبون
                      </p>

                      <p className="mt-2 text-sm leading-6 text-coffee">
                        {order.notes}
                      </p>

                    </div>

                  )}


                  {/* Items */}
                  <div className="border-b border-sand p-5">

                    <div className="mb-4 flex items-center gap-2 font-bold text-ink">

                      <Package
                        size={18}
                      />

                      المنتجات

                    </div>


                    <div className="space-y-3">

                      {order.items.map(
                        (item) => (

                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-4 rounded-xl bg-cream p-3"
                          >

                            <div className="min-w-0">

                              <p className="truncate text-sm font-bold text-ink">
                                {
                                  item.product_name
                                }
                              </p>

                              <p className="mt-1 text-xs text-coffee">

                                {formatPrice(
                                  item.unit_price
                                )}

                                {' × '}

                                {
                                  item.quantity
                                }

                              </p>

                            </div>


                            <span className="shrink-0 text-sm font-bold text-coffee-dark">

                              {formatPrice(
                                item.line_total
                              )}

                            </span>

                          </div>

                        )
                      )}

                    </div>

                  </div>


                  {/* Totals */}
                  <div className="border-b border-sand p-5">

                    <div className="space-y-3">

                      <div className="flex items-center justify-between text-sm">

                        <span className="text-coffee">
                          قيمة المنتجات
                        </span>

                        <span className="font-bold text-coffee-dark">

                          {formatPrice(
                            order.total_amount
                          )}

                        </span>

                      </div>


                      <div className="flex items-center justify-between text-sm">

                        <span className="text-coffee">
                          رسوم التوصيل
                        </span>

                        <span className="font-bold text-coffee-dark">

                          {formatPrice(
                            order.delivery_fee
                          )}

                        </span>

                      </div>


                      <div className="border-t border-sand pt-3">

                        <div className="flex items-center justify-between">

                          <span className="font-bold text-ink">
                            المبلغ عند الاستلام
                          </span>

                          <span className="text-xl font-bold text-coffee-dark">

                            {formatPrice(
                              order.grand_total
                            )}

                          </span>

                        </div>

                      </div>

                    </div>


                    <p className="mt-3 text-xs text-coffee">
                      الدفع عند الاستلام
                    </p>

                  </div>


                  {/* Status */}
                  <div className="p-5">

                    <label className="mb-2 block text-sm font-bold text-ink">
                      حالة الطلب
                    </label>


                    <select
                      value={
                        order.status
                      }
                      disabled={
                        isUpdating
                      }
                      onChange={(event) =>
                        handleStatusChange(
                          order.id,
                          event.target.value
                        )
                      }
                      className="h-12 w-full rounded-xl border border-sand bg-cream px-4 text-sm font-bold text-coffee-dark outline-none focus:border-coffee disabled:opacity-60"
                    >

                      <option value="new">
                        جديد
                      </option>

                      <option value="confirmed">
                        تم التأكيد
                      </option>

                      <option value="delivered">
                        تم التوصيل
                      </option>

                      <option value="cancelled">
                        ملغي
                      </option>

                    </select>


                    {isUpdating && (

                      <p className="mt-2 text-xs text-coffee">
                        جاري تحديث الحالة...
                      </p>

                    )}


                    {statusMutation.isError &&
                      statusMutation.variables
                        ?.orderId ===
                        order.id && (

                        <p className="mt-2 text-xs text-red-600">
                          تعذر تحديث حالة الطلب
                        </p>

                      )}

                  </div>

                </article>
              )
            }
          )}

        </div>

      </main>

    </div>
  )
}


export default AdminOrdersPage