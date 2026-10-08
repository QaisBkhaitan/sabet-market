import {
  ArrowRight,
  PackageSearch,
} from 'lucide-react'

import {
  Link,
  useParams,
} from 'react-router-dom'

import {
  useQuery,
} from '@tanstack/react-query'

import ProductCard from '../components/product/ProductCard'

import {
  getCategories,
  getCategoryProducts,
} from '../services/api'


function CategoryProductsPage() {
  const {
    slug = '',
  } = useParams()


  const {
    data: categories = [],
  } = useQuery({
    queryKey: [
      'categories',
    ],

    queryFn:
      getCategories,
  })


  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      'category-products',
      slug,
    ],

    queryFn: () =>
      getCategoryProducts(
        slug
      ),

    enabled:
      Boolean(slug),
  })


  const category =
    categories.find(
      (item) =>
        item.slug === slug
    )


  return (
    <div className="min-h-screen bg-cream">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">

        {/* Back */}
        <Link
          to="/groups"
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:text-primary-dark"
        >

          <ArrowRight
            size={17}
          />

          المجموعات

        </Link>


        {/* Page Header */}
        <section className="rounded-[26px] border border-sand bg-soft px-5 py-6 sm:px-7">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">

              <PackageSearch
                size={23}
                strokeWidth={1.8}
              />

            </div>


            <div className="min-w-0">

              <p className="text-xs font-medium text-muted-light">
                المجموعة
              </p>

              <h1 className="mt-1 truncate text-2xl font-bold text-ink">
                {category?.name_ar ??
                  'المنتجات'}
              </h1>

              <p className="mt-1 text-sm text-muted">
                تصفح المنتجات واختار اللي بناسبك
              </p>

            </div>

          </div>

        </section>


        {/* Loading */}
        {isLoading && (

          <div className="mt-6 rounded-2xl border border-sand bg-card p-10 text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-sand border-t-primary" />

            <p className="mt-4 text-sm text-muted">
              جاري تحميل المنتجات...
            </p>

          </div>

        )}


        {/* Error */}
        {isError && (

          <div className="mt-6 rounded-2xl border border-sand bg-card p-8 text-center">

            <PackageSearch
              size={30}
              className="mx-auto text-muted-light"
            />

            <h2 className="mt-3 font-bold text-ink">
              المجموعة غير موجودة
            </h2>

            <p className="mt-2 text-sm text-muted">
              قد تكون المجموعة غير متوفرة حالياً
            </p>


            <Link
              to="/groups"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-dark"
            >
              عرض المجموعات
            </Link>

          </div>

        )}


        {/* Products */}
        {!isLoading &&
          !isError && (

            <section className="mt-7">

              <div className="mb-4 flex items-end justify-between gap-4">

                <div>

                  <p className="text-xs font-medium text-muted-light">
                    المنتجات المتوفرة
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-ink">
                    {category?.name_ar ??
                      'المنتجات'}
                  </h2>

                </div>


                <span className="shrink-0 text-xs text-muted-light">
                  {products.length}{' '}
                  {products.length === 1
                    ? 'منتج'
                    : 'منتجات'}
                </span>

              </div>


              {products.length === 0 ? (

                <div className="rounded-2xl border border-sand bg-card p-10 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-soft text-primary">

                    <PackageSearch
                      size={25}
                    />

                  </div>

                  <p className="mt-4 font-bold text-ink">
                    لا توجد منتجات حالياً
                  </p>

                  <p className="mt-2 text-sm text-muted">
                    ما في منتجات ضمن هذه المجموعة في الوقت الحالي
                  </p>


                  <Link
                    to="/groups"
                    className="mt-5 inline-flex h-11 items-center justify-center rounded-xl border border-sand bg-cream px-5 text-sm font-bold text-primary transition hover:bg-soft"
                  >
                    تصفح مجموعات أخرى
                  </Link>

                </div>

              ) : (

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

                  {products.map(
                    (product) => (

                      <ProductCard
                        key={
                          product.id
                        }
                        product={
                          product
                        }
                      />

                    )
                  )}

                </div>

              )}

            </section>

          )}

      </div>

    </div>
  )
}


export default CategoryProductsPage