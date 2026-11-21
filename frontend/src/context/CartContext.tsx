import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { ReactNode } from 'react'
import type { Product } from '../types/product'
import type { CartItem } from '../types/cart'
import { trackMetaEvent } from '../utils/metaPixel'

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  increaseQuantity: (productId: number) => void
  decreaseQuantity: (productId: number) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
}

interface CartProviderProps {
  children: ReactNode
}

const CartContext = createContext<CartContextType | undefined>(
  undefined
)

const STORAGE_KEY = 'jenin-supermarket-cart'

function getInitialCart(): CartItem[] {
  try {
    const storedCart = localStorage.getItem(STORAGE_KEY)

    if (!storedCart) {
      return []
    }

    return JSON.parse(storedCart)
  } catch {
    return []
  }
}

export function CartProvider({
  children,
}: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(
    getInitialCart
  )

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items)
    )
  }, [items])

  function addToCart(product: Product) {
    if (!product.is_available) {
      return
    }

    trackMetaEvent('AddToCart', {
      currency: 'ILS',
      value: product.price,
      content_type: 'product',
      content_ids: [String(product.id)],
      contents: [{ id: String(product.id), quantity: 1 }],
    })

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id
      )

      if (existingItem) {
        return currentItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      }

      return [
        ...currentItems,
        {
          product,
          quantity: 1,
        },
      ]
    })
  }

  function removeFromCart(productId: number) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.product.id !== productId
      )
    )
  }

  function increaseQuantity(productId: number) {
    const item = items.find((entry) => entry.product.id === productId)
    if (item) {
      trackMetaEvent('AddToCart', {
        currency: 'ILS',
        value: item.product.price,
        content_type: 'product',
        content_ids: [String(productId)],
        contents: [{ id: String(productId), quantity: 1 }],
      })
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    )
  }

  function decreaseQuantity(productId: number) {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.product.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  function clearCart() {
    setItems([])
  }

  const cartCount = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.quantity,
      0
    )
  }, [items])

  const cartTotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.product.price * item.quantity,
      0
    )
  }, [items])

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider'
    )
  }

  return context
}
