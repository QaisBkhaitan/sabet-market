import {
  Grid2X2,
} from 'lucide-react'

import {
  useQuery,
} from '@tanstack/react-query'

import CategoryCard from '../components/common/CategoryCard'

import {
  getCategories,
} from '../services/api'


function CategoriesPage() {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      'categories',
    ],

    queryFn:
      getCategories,
  })


  return (
    <div className="min-h-screen bg-cream">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">

        {/* Page Header */}
        <section className="rounded-[26px] border border-sand bg-soft px-5 py-6 sm:px-7">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card text-primary shadow-sm">

              <Grid2X2
                size={23}
                strokeWidth={1.8}
              />

            </div>


            <div>

              <h1 className="text-2xl font-bold text-ink">
                المجموعات
              </h1>

              <p className="mt-1 text-sm leading-6 text-muted">
                اختر القسم اللي بدك تتسوق منه
              </p>

            </div>

          </div>

        </section>


        {/* Loading */}
        {isLoading && (

          <div className="mt-6 rounded-2xl border border-sand bg-card p-10 text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-sand border-t-primary" />

            <p className="mt-4 text-sm text-muted">
              جاري تحميل المجموعات...
            </p>

          </div>

        )}


        {/* Error */}
        {isError && (

          <div className="mt-6 rounded-2xl border border-sand bg-card p-8 text-center">

            <p className="font-bold text-ink">
              تعذر تحميل المجموعات
            </p>

            <p className="mt-2 text-sm text-muted">
              حاول تحديث الصفحة مرة أخرى
            </p>

          </div>

        )}


        {/* Empty */}
        {!isLoading &&
          !isError &&
          categories.length === 0 && (

            <div className="mt-6 rounded-2xl border border-sand bg-card p-10 text-center">

              <Grid2X2
                size={30}
                className="mx-auto text-muted-light"
              />

              <p className="mt-3 font-bold text-ink">
                لا توجد مجموعات حالياً
              </p>

            </div>

          )}


        {/* Categories */}
        {!isLoading &&
          !isError &&
          categories.length > 0 && (

            <section className="mt-7">

              <div className="mb-4 flex items-center justify-between">

                <h2 className="text-lg font-bold text-ink">
                  تصفح المجموعات
                </h2>

                <span className="text-xs text-muted-light">
                  {categories.length} مجموعة
                </span>

              </div>


              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

                {categories.map(
                  (category) => (

                    <CategoryCard
                      key={category.id}
                      category={category}
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


export default CategoriesPage