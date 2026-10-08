import {
  ArrowLeft,
  ShoppingBasket,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import {
  useQuery,
} from '@tanstack/react-query'

import CategoryCard from '../components/common/CategoryCard'
import ProductCard from '../components/product/ProductCard'

import {
  getCategories,
  getProducts,
} from '../services/api'


function HomePage() {
  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useQuery({
    queryKey: [
      'categories',
    ],
    queryFn:
      getCategories,
  })


  const {
    data: featuredProducts = [],
    isLoading: productsLoading,
  } = useQuery({
    queryKey: [
      'products',
      'featured',
    ],

    queryFn: () =>
      getProducts({
        featured: true,
      }),
  })


  return (
    <div className="min-h-screen bg-[#F4EFE7]">

      <div className="mx-auto max-w-7xl px-4 py-5 sm:py-7">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[30px] border border-[#DED3C6] bg-[#E8DFD3]">

          {/* Decorative shapes */}
          <div className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full bg-[#D8CCBC]/60" />

          <div className="pointer-events-none absolute -bottom-24 left-28 h-44 w-44 rounded-full bg-[#F5F0E9]/80" />


          <div className="relative grid items-center gap-8 px-5 py-8 sm:px-8 sm:py-10 md:grid-cols-[1fr_260px] md:px-10">

            {/* Text */}
            <div className="relative z-10">

              <div className="inline-flex rounded-full border border-[#CFC2B2] bg-[#F7F3ED]/80 px-3 py-1.5 text-xs font-medium text-[#6F685F]">

                تسوّق بسهولة، واستلم طلبك عند الباب

              </div>


              <h1 className="mt-5 max-w-xl text-[30px] font-bold leading-[1.45] text-[#2F312D] sm:text-4xl">

                كل احتياجات بيتك،
                <br />

                <span className="text-primary">
                  من مكان واحد
                </span>

              </h1>


              <p className="mt-4 max-w-lg text-sm leading-7 text-[#716A62] sm:text-[15px]">

                اختار المنتجات اللي بدك إياها بسهولة،
                وإحنا بنتكفل بتجهيز طلبك وتوصيله إلك.

              </p>


              <Link
                to="/groups"
className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-bold text-white shadow-sm transition duration-200 hover:bg-primary-dark hover:shadow-md"              >

                ابدأ التسوق

                <ArrowLeft
                  size={17}
                />

              </Link>

            </div>


            {/* Hero Visual */}
            <div className="relative hidden h-56 items-center justify-center md:flex">

              <div className="absolute h-52 w-52 rounded-full border border-[#CFC2B2] bg-[#F5F0E9]/60" />


              <div className="relative flex h-32 w-32 items-center justify-center rounded-[32px] border border-[#D7CCBF] bg-[#FFFDF9] shadow-sm">

                <ShoppingBasket
                  size={48}
                  strokeWidth={1.5}
                  className="text-[#text-primary]"
                />

              </div>


              <div className="absolute bottom-2 right-1 rounded-2xl border border-[#D8CCBE] bg-[#FFFDF9] px-4 py-2 text-xs font-bold text-[#5D6257] shadow-sm">

                توصيل لباب البيت

              </div>

            </div>

          </div>

        </section>


        {/* Categories */}
        <section className="mt-10">

          <div className="flex items-end justify-between gap-4">

            <div>

              <p className="text-xs font-medium text-[#8C8175]">
                تصفح حسب القسم
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#2F312D] sm:text-2xl">
                المجموعات
              </h2>

            </div>


            <Link
              to="/groups"
              className="flex items-center gap-1 text-sm font-bold text-[#text-primary] transition hover:text-[#4F574A]"
            >

              عرض الكل

              <ArrowLeft
                size={15}
              />

            </Link>

          </div>


          {categoriesLoading ? (

            <div className="mt-5 rounded-2xl border border-[#DED3C6] bg-[#FFFDF9] p-8 text-center text-sm text-[#756D64]">

              جاري تحميل المجموعات...

            </div>

          ) : categories.length === 0 ? (

            <div className="mt-5 rounded-2xl border border-[#DED3C6] bg-[#FFFDF9] p-8 text-center text-sm text-[#756D64]">

              لا توجد مجموعات حالياً

            </div>

          ) : (

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

              {categories
                .slice(0, 4)
                .map(
                  (category) => (

                    <CategoryCard
                      key={category.id}
                      category={category}
                    />

                  )
                )}

            </div>

          )}

        </section>


        {/* Featured Products */}
        <section className="mt-12 pb-8">

          <div>

            <p className="text-xs font-medium text-[#8C8175]">
              اخترنا لك
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#2F312D] sm:text-2xl">
              منتجات مختارة
            </h2>

            <p className="mt-1.5 text-sm text-[#756D64]">
              مجموعة من المنتجات المميزة في المتجر
            </p>

          </div>


          {productsLoading ? (

            <div className="mt-5 rounded-2xl border border-[#DED3C6] bg-[#FFFDF9] p-8 text-center text-sm text-[#756D64]">

              جاري تحميل المنتجات...

            </div>

          ) : featuredProducts.length === 0 ? (

            <div className="mt-5 rounded-2xl border border-[#DED3C6] bg-[#FFFDF9] p-8 text-center text-sm text-[#756D64]">

              لا توجد منتجات مختارة حالياً

            </div>

          ) : (

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">

              {featuredProducts.map(
                (product) => (

                  <ProductCard
                    key={product.id}
                    product={product}
                  />

                )
              )}

            </div>

          )}

        </section>

      </div>

    </div>
  )
}


export default HomePage