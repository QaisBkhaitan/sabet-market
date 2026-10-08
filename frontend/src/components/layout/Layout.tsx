import type {
  ReactNode,
} from 'react'

import {
  useLocation,
} from 'react-router-dom'

import Header from './Header'
import Footer from './Footer'
import MobileBottomNav from './MobileBottomNav'


interface LayoutProps {
  children: ReactNode
}


function Layout({
  children,
}: LayoutProps) {
  const location =
    useLocation()


  const hideBottomNav =
    location.pathname === '/checkout' ||
    location.pathname === '/order-success'


  return (
    <div className="flex min-h-screen flex-col bg-cream">

      {/* Header */}
      <Header />


      {/* Page Content */}
      <main
        className={`flex-1 ${
          hideBottomNav
            ? ''
            : 'pb-[76px] md:pb-0'
        }`}
      >
        {children}
      </main>


      {/* Footer */}
      <Footer />


      {/* Mobile Navigation */}
      <MobileBottomNav />

    </div>
  )
}


export default Layout