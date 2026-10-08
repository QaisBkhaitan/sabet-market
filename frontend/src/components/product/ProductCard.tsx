import {
  Minus,
  Plus,
  ShoppingCart,
} from 'lucide-react'

import {
  Link,
} from 'react-router-dom'

import {
  useCart,
} from '../../context/CartContext'

import {
  getImageUrl,
} from '../../services/api'

import type {
  Product,
} from '../../types/product'

import {
  formatPrice,
} from '../../utils/formatPrice'


interface ProductCardProps {
  product: Product
}


function ProductCard({
  product,
}: ProductCardProps) {
  const {
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    items,
  } = useCart()


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
    <article className="group overflow-hidden rounded-[22px] border border-sand bg-card transition duration-200 hover:-translate-y-0.5 hover:border-[#CFC2B2] hover:shadow-sm">

      {/* Image */}
      <Link
        to={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-[#F1EBE3]"
      >

        <img
          src={
            imageUrl ??
            'https://placehold.co/600x600?text=Product'
          }
          alt={
            product.name_ar
          }
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]"
        />


        {/* Out of stock */}
        {!product.is_available && (

          <div className="absolute inset-0 flex items-center justify-center bg-card/75 backdrop-blur-[1px]">

            <span className="rounded-full border border-sand bg-card px-3 py-1.5 text-xs font-bold text-muted">
              انتهت الكمية
            </span>

          </div>

        )}


        {/* Featured */}
        {product.is_featured && (

          <span className="absolute right-2.5 top-2.5 rounded-full border border-white/60 bg-card/90 px-2.5 py-1 text-[10px] font-bold text-primary shadow-sm backdrop-blur">
            مميز
          </span>

        )}

      </Link>


      {/* Content */}
      <div className="p-3.5">

        {/* Name */}
        <Link
          to={`/products/${product.id}`}
          className="block"
        >

          <h3 className="line-clamp-2 min-h-12 text-sm font-bold leading-6 text-ink transition hover:text-primary">
            {product.name_ar}
          </h3>

        </Link>


        {/* Description */}
        {product.description_ar && (

          <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-muted">
            {product.description_ar}
          </p>

        )}


        {/* Price + Availability */}
        <div className="mt-3 flex items-center justify-between gap-3">

          <span className="text-xl font-bold text-primary">
            {formatPrice(
              product.price
            )}
          </span>


          {product.is_available && (

            <span className="rounded-full bg-[#EEF1EA] px-2.5 py-1 text-[10px] font-bold text-[#5F6958]">
              متوفر
            </span>

          )}

        </div>


        {/* Add to cart / Quantity */}
        {product.is_available ? (

          cartItem ? (

            <div className="mt-3">

              <div className="flex h-11 items-center justify-between rounded-xl border border-primary bg-cream p-1">

                {/* Decrease */}
                <button
                  type="button"
                  onClick={() =>
                    decreaseQuantity(
                      product.id
                    )
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-primary transition hover:bg-soft"
                  aria-label="تقليل الكمية"
                >
                  <Minus
                    size={17}
                    strokeWidth={2}
                  />
                </button>


                {/* Quantity */}
                <div className="text-center">

                  <span className="block text-sm font-bold text-ink">
                    {cartItem.quantity}
                  </span>

                  <span className="block text-[9px] leading-none text-muted-light">
                    في السلة
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
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white transition hover:bg-primary-dark"
                  aria-label="زيادة الكمية"
                >
                  <Plus
                    size={17}
                    strokeWidth={2}
                  />
                </button>

              </div>

            </div>

          ) : (

            <button
              type="button"
              onClick={() =>
                addToCart(
                  product
                )
              }
              className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white transition hover:bg-primary-dark"
            >

              <ShoppingCart
                size={17}
              />

              أضف للسلة

            </button>

          )

        ) : (

          <button
            type="button"
            disabled
            className="mt-3 flex h-11 w-full cursor-not-allowed items-center justify-center rounded-xl border border-sand bg-soft text-sm font-bold text-muted-light"
          >
            غير متوفر
          </button>

        )}

      </div>

    </article>
  )
}


export default ProductCard