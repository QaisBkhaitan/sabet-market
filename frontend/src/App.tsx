import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'

import Layout from './components/layout/Layout'

import HomePage from './pages/HomePage'
import CategoriesPage from './pages/CategoriesPage'
import CategoryProductsPage from './pages/CategoryProductsPage'
import ProductPage from './pages/ProductPage'
import SearchPage from './pages/SearchPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'

import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'

import AdminProtectedRoute from './components/admin/AdminProtectedRoute'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Customer Website */}

        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />

        <Route
          path="/groups"
          element={
            <Layout>
              <CategoriesPage />
            </Layout>
          }
        />

        <Route
          path="/groups/:slug"
          element={
            <Layout>
              <CategoryProductsPage />
            </Layout>
          }
        />

        <Route
          path="/products/:id"
          element={
            <Layout>
              <ProductPage />
            </Layout>
          }
        />

        <Route
          path="/search"
          element={
            <Layout>
              <SearchPage />
            </Layout>
          }
        />

        <Route
          path="/cart"
          element={
            <Layout>
              <CartPage />
            </Layout>
          }
        />

        <Route
          path="/checkout"
          element={
            <Layout>
              <CheckoutPage />
            </Layout>
          }
        />

        <Route
          path="/order-success"
          element={
            <Layout>
              <OrderSuccessPage />
            </Layout>
          }
        />


        {/* Admin */}

        <Route
          path="/admin/login"
          element={
            <AdminLoginPage />
          }
        />

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>

              <AdminDashboardPage />

            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminProtectedRoute>
              <AdminProductsPage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminProtectedRoute>
              <AdminCategoriesPage />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminProtectedRoute>
              <AdminOrdersPage />
            </AdminProtectedRoute>
          }
        />
      </Routes>

    </BrowserRouter>
  )
}


export default App