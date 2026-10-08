import {
  Grid2X2,
  Home,
  ShoppingCart,
} from 'lucide-react'

import {
  Link,
  useLocation,
} from 'react-router-dom'

import {
  useCart,
} from '../../context/CartContext'


function MobileBottomNav() {
  const location =
    useLocation()

  const {
    cartCount,
  } = useCart()


  /*
    في صفحات إتمام الطلب ونجاحه
    نخفي القائمة حتى ما نشتت الزبون.
  */
  if (
    location.pathname === '/checkout' ||
    location.pathname === '/order-success'
  ) {
    return null
  }


  const homeActive =
    location.pathname === '/'


  const groupsActive =
    location.pathname.startsWith(
      '/groups'
    ) ||
    location.pathname.startsWith(
      '/products'
    )


  const cartActive =
    location.pathname === '/cart'


  const baseItemClass =
    'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition'


  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-card/95 backdrop-blur-md md:hidden">

      <div className="mx-auto flex h-[68px] max-w-lg items-center px-4">

        {/* Home */}
        <Link
          to="/"
          className={`${baseItemClass} ${
            homeActive
              ? 'text-primary'
              : 'text-muted-light'
          }`}
        >

          <div
            className={`flex h-8 w-10 items-center justify-center rounded-xl transition ${
              homeActive
                ? 'bg-soft'
                : ''
            }`}
          >

            <Home
              size={20}
              strokeWidth={
                homeActive
                  ? 2.2
                  : 1.8
              }
            />

          </div>

          <span>
            الرئيسية
          </span>

        </Link>


        {/* Groups */}
        <Link
          to="/groups"
          className={`${baseItemClass} ${
            groupsActive
              ? 'text-primary'
              : 'text-muted-light'
          }`}
        >

          <div
            className={`flex h-8 w-10 items-center justify-center rounded-xl transition ${
              groupsActive
                ? 'bg-soft'
                : ''
            }`}
          >

            <Grid2X2
              size={20}
              strokeWidth={
                groupsActive
                  ? 2.2
                  : 1.8
              }
            />

          </div>

          <span>
            المجموعات
          </span>

        </Link>


        {/* Cart */}
        <Link
          to="/cart"
          className={`${baseItemClass} ${
            cartActive
              ? 'text-primary'
              : 'text-muted-light'
          }`}
        >

          <div
            className={`relative flex h-8 w-10 items-center justify-center rounded-xl transition ${
              cartActive
                ? 'bg-soft'
                : ''
            }`}
          >

            <ShoppingCart
              size={20}
              strokeWidth={
                cartActive
                  ? 2.2
                  : 1.8
              }
            />


            {cartCount > 0 && (

              <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">

                {cartCount}

              </span>

            )}

          </div>

          <span>
            السلة
          </span>

        </Link>

      </div>

    </nav>
  )
}


export default MobileBottomNav