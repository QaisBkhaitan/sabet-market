import {
  LogOut,
  Package,
  ShoppingBag,
  Tags,
} from 'lucide-react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  adminGetCategories,
  adminGetOrders,
  adminGetProducts,
  adminLogout,
} from '../../services/api'


function AdminDashboardPage() {
  const navigate =
    useNavigate()

  const queryClient =
    useQueryClient()


  /*
    المنتجات
  */
  const {
    data: products = [],
    isLoading:
      productsLoading,
  } = useQuery({
    queryKey: [
      'admin-products',
    ],

    queryFn:
      adminGetProducts,
  })


  /*
    المجموعات
  */
  const {
    data: categories = [],
    isLoading:
      categoriesLoading,
  } = useQuery({
    queryKey: [
      'admin-categories',
    ],

    queryFn:
      adminGetCategories,
  })


  /*
    الطلبات
  */
  const {
    data: orders = [],
    isLoading:
      ordersLoading,
  } = useQuery({
    queryKey: [
      'admin-orders',
    ],

    queryFn:
      adminGetOrders,
  })


  /*
    عدد الطلبات الجديدة.
  */
  const newOrdersCount =
    orders.filter(
      (order) =>
        order.status === 'new'
    ).length


  /*
    تسجيل الخروج.
  */
  const logoutMutation =
    useMutation({
      mutationFn:
        adminLogout,

      onSuccess: () => {
        queryClient.removeQueries({
          queryKey: [
            'admin',
          ],
        })

        navigate(
          '/admin/login',
          {
            replace: true,
          }
        )
      },
    })


  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
      <header className="border-b border-sand bg-card">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

          <div>

            <h1 className="font-bold text-ink">
              لوحة الإدارة
            </h1>

            <p className="text-xs text-coffee">
              السَبت ماركت
            </p>

          </div>


          <button
            type="button"
            onClick={() =>
              logoutMutation.mutate()
            }
            disabled={
              logoutMutation.isPending
            }
            className="flex items-center gap-2 rounded-xl border border-sand px-3 py-2 text-sm text-coffee-dark transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-60"
          >

            <LogOut
              size={17}
            />

            {logoutMutation.isPending
              ? 'جاري الخروج...'
              : 'تسجيل الخروج'}

          </button>

        </div>

      </header>


      <main className="mx-auto max-w-7xl px-4 py-6">

        {/* Welcome */}
        <div>

          <h2 className="text-2xl font-bold text-ink">
            أهلاً بك 👋
          </h2>

          <p className="mt-1 text-sm text-coffee">
            من هنا يمكنك إدارة المتجر ومتابعة الطلبات
          </p>

        </div>


        {/* New Orders Alert */}
        {!ordersLoading &&
          newOrdersCount > 0 && (

            <Link
              to="/admin/orders"
              className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-coffee bg-card p-4 transition hover:shadow-sm"
            >

              <div>

                <p className="font-bold text-ink">
                  لديك طلبات جديدة
                </p>

                <p className="mt-1 text-sm text-coffee">
                  يوجد{' '}
                  {newOrdersCount}{' '}
                  {newOrdersCount === 1
                    ? 'طلب جديد بانتظار المراجعة'
                    : 'طلبات جديدة بانتظار المراجعة'}
                </p>

              </div>


              <div className="flex h-11 min-w-11 items-center justify-center rounded-full bg-coffee-dark px-3 text-sm font-bold text-white">

                {newOrdersCount}

              </div>

            </Link>

          )}


        {/* Dashboard Cards */}
        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">

          {/* Products */}
          <Link
            to="/admin/products"
            className="group rounded-2xl border border-sand bg-card p-5 text-right transition hover:-translate-y-0.5 hover:shadow-sm"
          >

            <div className="flex items-start justify-between gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream text-coffee-dark">

                <Package
                  size={22}
                />

              </div>


              <div className="text-left">

                <p className="text-xs text-coffee">
                  عدد المنتجات
                </p>

                <p className="mt-1 text-2xl font-bold text-coffee-dark">

                  {productsLoading
                    ? '...'
                    : products.length}

                </p>

              </div>

            </div>


            <h3 className="mt-4 font-bold text-ink">
              المنتجات
            </h3>

            <p className="mt-1 text-xs leading-5 text-coffee">
              إضافة وتعديل وإدارة المنتجات
            </p>

          </Link>


          {/* Categories */}
          <Link
            to="/admin/categories"
            className="group rounded-2xl border border-sand bg-card p-5 text-right transition hover:-translate-y-0.5 hover:shadow-sm"
          >

            <div className="flex items-start justify-between gap-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream text-coffee-dark">

                <Tags
                  size={22}
                />

              </div>


              <div className="text-left">

                <p className="text-xs text-coffee">
                  عدد المجموعات
                </p>

                <p className="mt-1 text-2xl font-bold text-coffee-dark">

                  {categoriesLoading
                    ? '...'
                    : categories.length}

                </p>

              </div>

            </div>


            <h3 className="mt-4 font-bold text-ink">
              المجموعات
            </h3>

            <p className="mt-1 text-xs leading-5 text-coffee">
              إدارة مجموعات المنتجات
            </p>

          </Link>


          {/* Orders */}
          <Link
            to="/admin/orders"
            className={`group rounded-2xl bg-card p-5 text-right transition hover:-translate-y-0.5 hover:shadow-sm ${
              newOrdersCount > 0
                ? 'border-2 border-coffee'
                : 'border border-sand'
            }`}
          >

            <div className="flex items-start justify-between gap-4">

              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-cream text-coffee-dark">

                <ShoppingBag
                  size={22}
                />


                {newOrdersCount > 0 && (

                  <span className="absolute -left-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-coffee-dark px-1 text-[11px] font-bold text-white">

                    {newOrdersCount}

                  </span>

                )}

              </div>


              <div className="text-left">

                <p className="text-xs text-coffee">
                  إجمالي الطلبات
                </p>

                <p className="mt-1 text-2xl font-bold text-coffee-dark">

                  {ordersLoading
                    ? '...'
                    : orders.length}

                </p>

              </div>

            </div>


            <div className="mt-4 flex flex-wrap items-center gap-2">

              <h3 className="font-bold text-ink">
                الطلبات
              </h3>


              {!ordersLoading &&
                newOrdersCount > 0 && (

                  <span className="rounded-full bg-cream px-2 py-1 text-[10px] font-bold text-coffee-dark">

                    {newOrdersCount}{' '}
                    {newOrdersCount === 1
                      ? 'طلب جديد'
                      : 'طلبات جديدة'}

                  </span>

                )}

            </div>


            <p className="mt-1 text-xs leading-5 text-coffee">
              عرض ومتابعة طلبات الزبائن
            </p>

          </Link>

        </div>


        {/* Quick Summary */}
        {!ordersLoading && (

          <div className="mt-6 rounded-2xl border border-sand bg-card p-5">

            <h3 className="font-bold text-ink">
              ملخص سريع
            </h3>


            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

              <div className="rounded-xl bg-cream p-3">

                <p className="text-xs text-coffee">
                  جديد
                </p>

                <p className="mt-1 text-lg font-bold text-ink">

                  {
                    orders.filter(
                      (order) =>
                        order.status ===
                        'new'
                    ).length
                  }

                </p>

              </div>


              <div className="rounded-xl bg-cream p-3">

                <p className="text-xs text-coffee">
                  تم التأكيد
                </p>

                <p className="mt-1 text-lg font-bold text-ink">

                  {
                    orders.filter(
                      (order) =>
                        order.status ===
                        'confirmed'
                    ).length
                  }

                </p>

              </div>


              <div className="rounded-xl bg-cream p-3">

                <p className="text-xs text-coffee">
                  تم التوصيل
                </p>

                <p className="mt-1 text-lg font-bold text-ink">

                  {
                    orders.filter(
                      (order) =>
                        order.status ===
                        'delivered'
                    ).length
                  }

                </p>

              </div>


              <div className="rounded-xl bg-cream p-3">

                <p className="text-xs text-coffee">
                  ملغي
                </p>

                <p className="mt-1 text-lg font-bold text-ink">

                  {
                    orders.filter(
                      (order) =>
                        order.status ===
                        'cancelled'
                    ).length
                  }

                </p>

              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  )
}


export default AdminDashboardPage