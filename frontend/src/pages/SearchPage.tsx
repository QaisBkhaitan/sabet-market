import {
  Search,
  SearchX,
} from 'lucide-react'

import {
  useSearchParams,
} from 'react-router-dom'

import {
  useQuery,
} from '@tanstack/react-query'

import ProductCard from '../components/product/ProductCard'

import {
  getProducts,
} from '../services/api'


function SearchPage() {
  const [
    searchParams,
  ] = useSearchParams()


  const query =
    searchParams
      .get('q')
      ?.trim() || ''


  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      'products',
      'search',
      query,
    ],

    queryFn: () =>
      getProducts({
        search: query,
      }),

    enabled:
      Boolean(query),
  })


  /*
    No search query
  */
  if (!query) {
    return (
      <div className="min-h-screen bg-cream">

        <div className="mx-auto max-w-7xl px-4 py-8">

          <div className="mx-auto max-w-xl rounded-[26px] border border-sand bg-card p-8 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-soft text-primary">

              <Search
                size={25}
                strokeWidth={1.8}
              />

            </div>


            <h1 className="mt-4 text-xl font-bold text-ink">
              ابحث عن منتج
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted">
              اكتب اسم المنتج في خانة البحث بالأعلى
            </p>

          </div>

        </div>

      </div>
    )
  }


  return (
    <div className="min-h-screen bg-cream">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">

        {/* Header */}
        <section className="rounded-[26px] border border-sand bg-soft px-5 py-6 sm:px-7">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">

              <Search
                size={22}
                strokeWidth={1.8}
              />

            </div>


            <div className="min-w-0">

              <p className="text-xs font-medium text-muted-light">
                نتائج البحث عن
              </p>

              <h1 className="mt-1 truncate text-xl font-bold text-ink sm:text-2xl">
                {query}
              </h1>

            </div>

          </div>

        </section>


        {/* Loading */}
        {isLoading && (

          <div className="mt-6 rounded-2xl border border-sand bg-card p-10 text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-sand border-t-primary" />

            <p className="mt-4 text-sm text-muted">
              جاري البحث...
            </p>

          </div>

        )}


        {/* Error */}
        {isError && (

          <div className="mt-6 rounded-2xl border border-sand bg-card p-8 text-center">

            <SearchX
              size={30}
              className="mx-auto text-muted-light"
            />

            <h2 className="mt-3 font-bold text-ink">
              تعذر إتمام البحث
            </h2>

            <p className="mt-2 text-sm text-muted">
              حاول البحث مرة أخرى
            </p>

          </div>

        )}


        {/* Empty */}
        {!isLoading &&
          !isError &&
          products.length === 0 && (

            <div className="mt-6 rounded-[26px] border border-sand bg-card p-10 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-soft text-primary">

                <SearchX
                  size={25}
                />

              </div>


              <h2 className="mt-4 font-bold text-ink">
                ما لقينا نتائج
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted">
                جرّب اسم أقصر أو كلمة مختلفة
              </p>

            </div>

          )}


        {/* Results */}
        {!isLoading &&
          !isError &&
          products.length > 0 && (

            <section className="mt-7">

              <div className="mb-4 flex items-end justify-between gap-4">

                <div>

                  <p className="text-xs font-medium text-muted-light">
                    المنتجات المطابقة
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-ink">
                    نتائج البحث
                  </h2>

                </div>


                <span className="shrink-0 text-xs text-muted-light">

                  {products.length}{' '}

                  {products.length === 1
                    ? 'منتج'
                    : 'منتجات'}

                </span>

              </div>


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

            </section>

          )}

      </div>

    </div>
  )
}


export default SearchPage