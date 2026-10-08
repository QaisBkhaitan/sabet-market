import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingCart,
} from 'lucide-react'

import {
  Link,
  useParams,
} from 'react-router-dom'

import {
  useQuery,
} from '@tanstack/react-query'

import {
  getCategories,
  getImageUrl,
  getProduct,
} from '../services/api'

import {
  useCart,
} from '../context/CartContext'

import {
  formatPrice,
} from '../utils/formatPrice'


function ProductPage() {
  const {
    id,
  } = useParams()


  const productId =
    Number(id)


  const {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    items,
  } = useCart()


  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      'product',
      productId,
    ],

    queryFn: () =>
      getProduct(
        productId
      ),

    enabled:
      Number.isFinite(
        productId
      ) &&
      productId > 0,
  })


  const {
    data: categories = [],
  } = useQuery({
    queryKey: [
      'categories',
    ],

    queryFn:
      getCategories,
  })


  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream px-4 py-10">

        <div className="mx-auto max-w-5xl rounded-2xl border border-sand bg-card p-10 text-center">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-sand border-t-primary" />

          <p className="mt-4 text-sm text-muted">
            جاري تحميل المنتج...
          </p>

        </div>

      </div>
    )
  }


  if (
    isError ||
    !product
  ) {
    return (
      <div className="min-h-screen bg-cream px-4 py-10">

        <div className="mx-auto max-w-xl rounded-[26px] border border-sand bg-card p-8 text-center">

          <h1 className="text-xl font-bold text-ink">
            المنتج غير موجود
          </h1>

          <p className="mt-2 text-sm text-muted">
            قد يكون المنتج غير متوفر حالياً
          </p>


          <Link
            to="/groups"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-dark"
          >
            العودة للمجموعات
          </Link>

        </div>

      </div>
    )
  }


  const category =
    categories.find(
      (item) =>
        item.id ===
        product.category_id
    )


  const cartItem =
    items.find(
      (item) =>
        item.product.id ===
        product.id
    )


  const imageUrl =
    getImageUrl(
      product.image
    )


  return (
    <div className="min-h-screen bg-cream">

      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">

        {/* Back */}
        <Link
          to={
            category
              ? `/groups/${category.slug}`
              : '/groups'
          }
          className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:text-primary-dark"
        >

          <ArrowRight
            size={17}
          />

          {category
            ? category.name_ar
            : 'المجموعات'}

        </Link>


        {/* Product */}
        <article className="overflow-hidden rounded-[30px] border border-sand bg-card md:grid md:grid-cols-2">

          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-[#F1EBE3] md:aspect-auto md:min-h-[520px]">

            <img
              src={
                imageUrl ??
                'https://placehold.co/700x700?text=Product'
              }
              alt={
                product.name_ar
              }
              className="h-full w-full object-cover"
            />


            {product.is_featured && (

              <span className="absolute right-4 top-4 rounded-full border border-white/60 bg-card/90 px-3 py-1.5 text-xs font-bold text-primary shadow-sm backdrop-blur">
                منتج مميز
              </span>

            )}


            {!product.is_available && (

              <div className="absolute inset-0 flex items-center justify-center bg-card/65 backdrop-blur-[1px]">

                <span className="rounded-full border border-sand bg-card px-4 py-2 text-sm font-bold text-muted">
                  انتهت الكمية
                </span>

              </div>

            )}

          </div>


          {/* Details */}
          <div className="flex flex-col p-5 sm:p-7 md:p-9">

            {category && (

              <Link
                to={`/groups/${category.slug}`}
                className="w-fit rounded-full bg-soft px-3 py-1.5 text-xs font-bold text-primary transition hover:bg-sand"
              >
                {category.name_ar}
              </Link>

            )}


            <h1 className="mt-4 text-2xl font-bold leading-9 text-ink sm:text-3xl">
              {product.name_ar}
            </h1>


            {product.description_ar && (

              <p className="mt-3 text-sm leading-7 text-muted sm:text-[15px]">
                {product.description_ar}
              </p>

            )}


            {/* Price */}
            <div className="mt-7 rounded-2xl bg-cream p-4">

              <p className="text-xs text-muted-light">
                السعر
              </p>

              <p className="mt-1 text-3xl font-bold text-primary">
                {formatPrice(
                  product.price
                )}
              </p>

            </div>


            {/* Availability */}
            <div className="mt-4">

              {product.is_available ? (

                <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF1EA] px-3 py-2 text-xs font-bold text-[#5F6958]">

                  <Check
                    size={15}
                    strokeWidth={2.2}
                  />

                  متوفر حالياً

                </div>

              ) : (

                <div className="inline-flex rounded-full bg-soft px-3 py-2 text-xs font-bold text-muted">
                  غير متوفر حالياً
                </div>

              )}

            </div>


            {/* Add / Quantity */}
            {product.is_available ? (

              cartItem ? (

                <div className="mt-6">

                  <p className="mb-2 text-xs font-medium text-muted">
                    الكمية في السلة
                  </p>


                  <div className="flex h-14 items-center justify-between rounded-2xl border border-primary bg-cream p-1.5">

                    {/* Decrease */}
                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          product.id
                        )
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-primary transition hover:bg-soft"
                      aria-label="تقليل الكمية"
                    >

                      <Minus
                        size={19}
                      />

                    </button>


                    {/* Quantity */}
                    <div className="text-center">

                      <span className="block text-lg font-bold text-ink">
                        {cartItem.quantity}
                      </span>

                      <span className="block text-[10px] text-muted-light">
                        قطعة
                      </span>

                    </div>


                    {/* Increase */}
                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          product.id
                        )
                      }
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary-dark"
                      aria-label="زيادة الكمية"
                    >

                      <Plus
                        size={19}
                      />

                    </button>

                  </div>


                  <Link
                    to="/cart"
                    className="mt-3 flex h-12 w-full items-center justify-center rounded-2xl border border-primary bg-card text-sm font-bold text-primary transition hover:bg-soft"
                  >
                    عرض السلة
                  </Link>

                </div>

              ) : (

                <button
                  type="button"
                  onClick={() =>
                    addToCart(
                      product
                    )
                  }
                  className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark hover:shadow-md"
                >

                  <ShoppingCart
                    size={19}
                  />

                  أضف للسلة

                </button>

              )

            ) : (

              <button
                type="button"
                disabled
                className="mt-6 flex h-13 w-full cursor-not-allowed items-center justify-center rounded-2xl border border-sand bg-soft text-sm font-bold text-muted-light"
              >
                غير متوفر
              </button>

            )}

          </div>

        </article>

      </div>

    </div>
  )
}


export default ProductPage