import {
  Link,
} from 'react-router-dom'


function Footer() {
  const currentYear =
    new Date().getFullYear()


  return (
    <footer className="border-t border-sand bg-card">

      <div className="mx-auto max-w-7xl px-4 py-8">

        <div className="flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-right">

          {/* Brand */}
          <div>

            <p className="font-bold text-ink">
              السَبت ماركت
            </p>

            <p className="mt-1 text-xs leading-5 text-muted">
              تسوّق بسهولة واستلم طلبك عند الباب
            </p>

          </div>


          {/* Links */}
          <div className="flex items-center gap-5 text-xs font-medium text-muted">

            <Link
              to="/"
              className="transition hover:text-primary"
            >
              الرئيسية
            </Link>

            <Link
              to="/groups"
              className="transition hover:text-primary"
            >
              المجموعات
            </Link>

            <Link
              to="/cart"
              className="transition hover:text-primary"
            >
              السلة
            </Link>

          </div>

        </div>


        <div className="mt-6 border-t border-sand pt-5 text-center text-[11px] text-muted-light">

          © {currentYear} السَبت ماركت

        </div>

      </div>

    </footer>
  )
}


export default Footer