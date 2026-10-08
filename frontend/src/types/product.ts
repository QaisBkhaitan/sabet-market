export interface Product {
  id: number
  name_ar: string
  description_ar: string | null
  price: number
  category_id: number
  image: string | null

  is_available: boolean
  is_featured: boolean
  is_active: boolean
}