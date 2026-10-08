import {
  useState,
  type SubmitEvent,
} from 'react'

import {
  Grid2X2,
  Home,
  Menu,
  Search,
  ShoppingCart,
  X,
} from 'lucide-react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  useCart,
} from '../../context/CartContext'


function Header() {
  const navigate =
    useNavigate()


  const {
    cartCount,
  } = useCart()


  const [
    searchQuery,
    setSearchQuery,
  ] = useState('')


  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false)


  function handleSearch(
    event: SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const trimmedQuery =
      searchQuery.trim()

    if (!trimmedQuery) {
      return
    }

    setMenuOpen(false)

    navigate(
      `/search?q=${encodeURIComponent(
        trimmedQuery
      )}`
    )
  }


  function closeMenu() {
    setMenuOpen(false)
  }


  return (
    <header className="sticky top-0 z-50 border-b border-sand bg-card/95 backdrop-blur-md">

      <div className="mx-auto max-w-7xl px-4">

        {/* Top Row */}
        <div className="grid h-16 grid-cols-[40px_1fr_40px] items-center gap-3">

          {/* Menu */}
          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (current) =>
                  !current
              )
            }
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
              menuOpen
                ? 'border-primary bg-primary text-white'
                : 'border-sand bg-cream text-primary hover:border-primary hover:bg-soft'
            }`}
            aria-label={
              menuOpen
                ? 'إغلاق القائمة'
                : 'فتح القائمة'
            }
            aria-expanded={
              menuOpen
            }
          >

            {menuOpen ? (
              <X
                size={21}
                strokeWidth={1.8}
              />
            ) : (
              <Menu
                size={22}
                strokeWidth={1.8}
              />
            )}

          </button>


          {/* Store Name */}
          <Link
            to="/"
            onClick={closeMenu}
            className="min-w-0 text-center"
          >

            <h1 className="truncate text-[17px] font-bold text-ink">
              السَبت ماركت
            </h1>

            <p className="mt-0.5 truncate text-[11px] text-muted-light">
              تسوّق بسهولة واستلم طلبك عند الباب
            </p>

          </Link>


          {/* Cart */}
          <Link
            to="/cart"
            onClick={closeMenu}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-primary transition hover:border-sand hover:bg-cream"
            aria-label="سلة التسوق"
          >

            <ShoppingCart
              size={22}
              strokeWidth={1.8}
            />


            {cartCount > 0 && (

              <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">

                {cartCount}

              </span>

            )}

          </Link>

        </div>


        {/* Dropdown Menu */}
        {menuOpen && (

          <div className="pb-4">

            <div className="overflow-hidden rounded-[22px] border border-sand bg-card shadow-lg">

              {/* Home */}
              <Link
                to="/"
                onClick={closeMenu}
                className="flex items-center gap-3 border-b border-sand px-4 py-4 transition hover:bg-cream"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-soft text-primary">

                  <Home
                    size={19}
                  />

                </div>


                <div>

                  <p className="text-sm font-bold text-ink">
                    الرئيسية
                  </p>

                  <p className="mt-0.5 text-[11px] text-muted-light">
                    العودة للصفحة الرئيسية
                  </p>

                </div>

              </Link>


              {/* Categories */}
              <Link
                to="/groups"
                onClick={closeMenu}
                className="flex items-center gap-3 border-b border-sand px-4 py-4 transition hover:bg-cream"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-soft text-primary">

                  <Grid2X2
                    size={19}
                  />

                </div>


                <div>

                  <p className="text-sm font-bold text-ink">
                    المجموعات
                  </p>

                  <p className="mt-0.5 text-[11px] text-muted-light">
                    تصفح أقسام ومنتجات المتجر
                  </p>

                </div>

              </Link>


              {/* Cart */}
              <Link
                to="/cart"
                onClick={closeMenu}
                className="flex items-center justify-between gap-3 px-4 py-4 transition hover:bg-cream"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-soft text-primary">

                    <ShoppingCart
                      size={19}
                    />

                  </div>


                  <div>

                    <p className="text-sm font-bold text-ink">
                      سلة التسوق
                    </p>

                    <p className="mt-0.5 text-[11px] text-muted-light">
                      راجع المنتجات الموجودة في السلة
                    </p>

                  </div>

                </div>


                {cartCount > 0 && (

                  <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-white">

                    {cartCount}

                  </span>

                )}

              </Link>

            </div>

          </div>

        )}


        {/* Search */}
        <form
          onSubmit={
            handleSearch
          }
          className="pb-4"
        >

          <div className="relative">

            <Search
              size={19}
              strokeWidth={1.8}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-light"
            />


            <input
              type="search"
              value={
                searchQuery
              }
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder="ابحث عن منتج..."
              className="h-12 w-full rounded-2xl border border-sand bg-cream pr-12 pl-20 text-sm text-ink outline-none transition placeholder:text-muted-light focus:border-primary focus:bg-card focus:ring-2 focus:ring-soft"
            />


            <button
              type="submit"
              className="absolute left-2 top-1/2 flex h-9 -translate-y-1/2 items-center justify-center rounded-xl bg-primary px-4 text-xs font-bold text-white transition hover:bg-primary-dark"
            >
              بحث
            </button>

          </div>

        </form>

      </div>

    </header>
  )
}


export default Header