import type { Category } from '../types/category'
import type { Product } from '../types/product'


const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000'


async function request<T>(
  path: string
): Promise<T> {
  const response = await fetch(
    `${API_URL}${path}`
  )

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status}`
    )
  }

  return response.json()
}


// Categories

export function getCategories() {
  return request<Category[]>(
    '/api/categories'
  )
}


export function getCategoryProducts(
  slug: string
) {
  return request<Product[]>(
    `/api/categories/${encodeURIComponent(slug)}/products`
  )
}


// Products

interface GetProductsParams {
  featured?: boolean
  search?: string
}


export function getProducts(
  params: GetProductsParams = {}
) {
  const searchParams =
    new URLSearchParams()

  if (params.featured !== undefined) {
    searchParams.set(
      'featured',
      String(params.featured)
    )
  }

  if (params.search) {
    searchParams.set(
      'search',
      params.search
    )
  }

  const queryString =
    searchParams.toString()

  const path = queryString
    ? `/api/products?${queryString}`
    : '/api/products'

  return request<Product[]>(path)
}


export function getProduct(
  productId: number
) {
  return request<Product>(
    `/api/products/${productId}`
  )
}

export interface Admin {
  id: number
  username: string
}


export async function adminLogin(
  username: string,
  password: string
): Promise<Admin> {
  const response = await fetch(
    `${API_URL}/api/admin/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      credentials: 'include',

      body: JSON.stringify({
        username,
        password,
      }),
    }
  )

  if (!response.ok) {
    throw new Error(
      'اسم المستخدم أو كلمة المرور غير صحيحة'
    )
  }

  return response.json()
}


export async function getCurrentAdmin(): Promise<Admin> {
  const response = await fetch(
    `${API_URL}/api/admin/me`,
    {
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error(
      'Not authenticated'
    )
  }

  return response.json()
}


export async function adminLogout() {
  const response = await fetch(
    `${API_URL}/api/admin/logout`,
    {
      method: 'POST',
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error(
      'Logout failed'
    )
  }

  return response.json()
}

export interface AdminCreateProductData {
  name_ar: string
  description_ar: string | null
  price: number
  category_id: number
  is_available: boolean
  is_featured: boolean
  image: File | null
}

export interface AdminUpdateProductData {
  id: number
  name_ar: string
  description_ar: string | null
  price: number
  category_id: number
  is_available: boolean
  is_featured: boolean
  image: File | null
}
export async function adminGetProducts(): Promise<Product[]> {
  const response = await fetch(
    `${API_URL}/api/admin/products`,
    {
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error(
      'Failed to load admin products'
    )
  }

  return response.json()
}


export async function adminCreateProduct(
  data: AdminCreateProductData
): Promise<Product> {
  const formData =
    new FormData()


  formData.append(
    'name_ar',
    data.name_ar
  )


  if (data.description_ar) {
    formData.append(
      'description_ar',
      data.description_ar
    )
  }


  formData.append(
    'price',
    String(data.price)
  )


  formData.append(
    'category_id',
    String(data.category_id)
  )


  formData.append(
    'is_available',
    String(data.is_available)
  )


  formData.append(
    'is_featured',
    String(data.is_featured)
  )


  if (data.image) {
    formData.append(
      'image',
      data.image
    )
  }


  const response = await fetch(
    `${API_URL}/api/admin/products`,
    {
      method: 'POST',

      credentials: 'include',

      body: formData,
    }
  )


  if (!response.ok) {
    let message =
      'حدث خطأ أثناء إضافة المنتج'

    try {
      const errorData =
        await response.json()

      if (
        typeof errorData.detail
        === 'string'
      ) {
        message =
          errorData.detail
      }
    } catch {
      // Keep default message
    }

    throw new Error(message)
  }


  return response.json()
}
export function getImageUrl(
  image: string | null
): string | null {
  if (!image) {
    return null
  }

  if (
    image.startsWith('http://') ||
    image.startsWith('https://')
  ) {
    return image
  }

  return `${API_URL}${image}`
}
export async function adminUpdateProduct(
  data: AdminUpdateProductData
): Promise<Product> {
  const formData =
    new FormData()


  formData.append(
    'name_ar',
    data.name_ar
  )


  formData.append(
    'description_ar',
    data.description_ar ?? ''
  )


  formData.append(
    'price',
    String(data.price)
  )


  formData.append(
    'category_id',
    String(data.category_id)
  )


  formData.append(
    'is_available',
    String(data.is_available)
  )


  formData.append(
    'is_featured',
    String(data.is_featured)
  )


  if (data.image) {
    formData.append(
      'image',
      data.image
    )
  }


  const response = await fetch(
    `${API_URL}/api/admin/products/${data.id}`,
    {
      method: 'PUT',

      credentials: 'include',

      body: formData,
    }
  )


  if (!response.ok) {
    let message =
      'حدث خطأ أثناء تعديل المنتج'

    try {
      const errorData =
        await response.json()

      if (
        typeof errorData.detail
        === 'string'
      ) {
        message =
          errorData.detail
      }
    } catch {
      // Keep default message
    }

    throw new Error(message)
  }


  return response.json()
}
export async function adminSetProductAvailability(
  productId: number,
  isAvailable: boolean
): Promise<Product> {
  const response = await fetch(
    `${API_URL}/api/admin/products/${productId}/availability`,
    {
      method: 'PATCH',

      credentials: 'include',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        is_available:
          isAvailable,
      }),
    }
  )


  if (!response.ok) {
    throw new Error(
      'حدث خطأ أثناء تغيير حالة المنتج'
    )
  }


  return response.json()
}


export async function adminSetProductVisibility(
  productId: number,
  isActive: boolean
): Promise<Product> {
  const response = await fetch(
    `${API_URL}/api/admin/products/${productId}/visibility`,
    {
      method: 'PATCH',

      credentials: 'include',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        is_active:
          isActive,
      }),
    }
  )


  if (!response.ok) {
    throw new Error(
      'حدث خطأ أثناء تغيير ظهور المنتج'
    )
  }


  return response.json()
}
export interface AdminCreateCategoryData {
  name_ar: string
  image: File | null
}


export interface AdminUpdateCategoryData {
  id: number
  name_ar: string
  image: File | null
}


export async function adminGetCategories(): Promise<Category[]> {
  const response = await fetch(
    `${API_URL}/api/admin/categories`,
    {
      credentials: 'include',
    }
  )


  if (!response.ok) {
    throw new Error(
      'حدث خطأ أثناء تحميل المجموعات'
    )
  }


  return response.json()
}


export async function adminCreateCategory(
  data: AdminCreateCategoryData
): Promise<Category> {
  const formData =
    new FormData()


  formData.append(
    'name_ar',
    data.name_ar
  )


  if (data.image) {
    formData.append(
      'image',
      data.image
    )
  }


  const response = await fetch(
    `${API_URL}/api/admin/categories`,
    {
      method: 'POST',

      credentials: 'include',

      body: formData,
    }
  )


  if (!response.ok) {
    let message =
      'حدث خطأ أثناء إضافة المجموعة'

    try {
      const errorData =
        await response.json()

      if (
        typeof errorData.detail
        === 'string'
      ) {
        message =
          errorData.detail
      }
    } catch {
      // keep default
    }

    throw new Error(message)
  }


  return response.json()
}


export async function adminUpdateCategory(
  data: AdminUpdateCategoryData
): Promise<Category> {
  const formData =
    new FormData()


  formData.append(
    'name_ar',
    data.name_ar
  )


  if (data.image) {
    formData.append(
      'image',
      data.image
    )
  }


  const response = await fetch(
    `${API_URL}/api/admin/categories/${data.id}`,
    {
      method: 'PUT',

      credentials: 'include',

      body: formData,
    }
  )


  if (!response.ok) {
    let message =
      'حدث خطأ أثناء تعديل المجموعة'

    try {
      const errorData =
        await response.json()

      if (
        typeof errorData.detail
        === 'string'
      ) {
        message =
          errorData.detail
      }
    } catch {
      // keep default
    }

    throw new Error(message)
  }


  return response.json()
}


export async function adminSetCategoryVisibility(
  categoryId: number,
  isActive: boolean
): Promise<Category> {
  const response = await fetch(
    `${API_URL}/api/admin/categories/${categoryId}/visibility`,
    {
      method: 'PATCH',

      credentials: 'include',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        is_active:
          isActive,
      }),
    }
  )


  if (!response.ok) {
    throw new Error(
      'حدث خطأ أثناء تغيير ظهور المجموعة'
    )
  }


  return response.json()
}
export interface CreateOrderItem {
  product_id: number
  quantity: number
}


export interface CreateOrderData {
  customer_name: string
  phone: string
  whatsapp: string | null

  city: string
  address: string

  latitude: number | null
  longitude: number | null

  notes: string | null

  items: CreateOrderItem[]
}

export interface OrderItemResponse {
  product_id: number
  product_name: string

  unit_price: number | string
  quantity: number
  line_total: number | string
}


export interface OrderResponse {
  id: number
  order_number: string

  customer_name: string
  phone: string
  whatsapp: string | null

  city: string
  address: string

  latitude: number | null
  longitude: number | null

  notes: string | null

  total_amount: number | string
  delivery_fee: number | string
  grand_total: number | string
  payment_method: string
  status: string

  items: OrderItemResponse[]
}


export async function createOrder(
  data: CreateOrderData
): Promise<OrderResponse> {
  const response = await fetch(
    `${API_URL}/api/orders`,
    {
      method: 'POST',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify(data),
    }
  )


  if (!response.ok) {
    let message =
      'حدث خطأ أثناء إرسال الطلب'

    try {
      const errorData =
        await response.json()

      if (
        typeof errorData.detail
        === 'string'
      ) {
        message =
          errorData.detail
      }
    } catch {
      // Keep default message
    }

    throw new Error(message)
  }


  return response.json()
}
export type AdminOrderStatus =
  | 'new'
  | 'confirmed'
  | 'delivered'
  | 'cancelled'


export interface AdminOrderItem {
  id: number

  product_id: number
  product_name: string

  unit_price: number | string
  quantity: number
  line_total: number | string
}


export interface AdminOrder {
  id: number
  order_number: string

  customer_name: string

  phone: string
  whatsapp: string | null
  city: string
  address: string

  latitude:
    | number
    | string
    | null

  longitude:
    | number
    | string
    | null

  notes: string | null

  total_amount:
    | number
    | string
  delivery_fee:
    | number
    | string

  grand_total:
    | number
    | string
  payment_method: string

  status:
    AdminOrderStatus

  created_at: string

  items: AdminOrderItem[]
}


export async function adminGetOrders():
Promise<AdminOrder[]> {
  const response = await fetch(
    `${API_URL}/api/admin/orders`,
    {
      credentials: 'include',
    }
  )


  if (!response.ok) {
    throw new Error(
      'حدث خطأ أثناء تحميل الطلبات'
    )
  }


  return response.json()
}


export async function adminUpdateOrderStatus(
  orderId: number,
  status: AdminOrderStatus
): Promise<AdminOrder> {
  const response = await fetch(
    `${API_URL}/api/admin/orders/${orderId}/status`,
    {
      method: 'PATCH',

      credentials: 'include',

      headers: {
        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        status,
      }),
    }
  )


  if (!response.ok) {
    let message =
      'حدث خطأ أثناء تحديث حالة الطلب'

    try {
      const data =
        await response.json()

      if (
        typeof data.detail
        === 'string'
      ) {
        message =
          data.detail
      }
    } catch {
      // keep default message
    }


    throw new Error(
      message
    )
  }


  return response.json()
}
export interface StoreConfig {
  delivery_fee: number | string
}


export async function getStoreConfig():
Promise<StoreConfig> {
  const response = await fetch(
    `${API_URL}/api/store-config`
  )

  if (!response.ok) {
    throw new Error(
      'تعذر تحميل إعدادات المتجر'
    )
  }

  return response.json()
}