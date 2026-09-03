// سياق سلة الطلبات — يُحفظ في localStorage لئلا تضيع السلة عند إغلاق التطبيق
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartItem } from '../types'

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'lineId'>) => void
  increment: (lineId: string) => void
  decrement: (lineId: string) => void
  removeItem: (lineId: string) => void
  clearCart: () => void
  replaceCart: (items: CartItem[]) => void
  totalCount: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | undefined>(undefined)
const STORAGE_KEY = 'manaqish_cart_v1'

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(item: Omit<CartItem, 'lineId'>) {
    setItems((prev) => {
      // إن كان نفس الصنف بنفس الخيار موجوداً بالفعل، نزيد الكمية بدل تكرار السطر
      const key = `${item.productId}-${item.variantLabel || ''}`
      const existing = prev.find((i) => `${i.productId}-${i.variantLabel || ''}` === key)
      if (existing) {
        return prev.map((i) => (i.lineId === existing.lineId ? { ...i, quantity: i.quantity + item.quantity } : i))
      }
      return [...prev, { ...item, lineId: `${key}-${Date.now()}` }]
    })
  }

  function increment(lineId: string) {
    setItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, quantity: i.quantity + 1 } : i)))
  }

  function decrement(lineId: string) {
    setItems((prev) =>
      prev
        .map((i) => (i.lineId === lineId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    )
  }

  function removeItem(lineId: string) {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId))
  }

  function clearCart() {
    setItems([])
  }

  function replaceCart(newItems: CartItem[]) {
    setItems(newItems)
  }

  const totalCount = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items])
  const totalPrice = useMemo(() => items.reduce((s, i) => s + i.quantity * i.unitPrice, 0), [items])

  return (
    <CartContext.Provider
      value={{ items, addItem, increment, decrement, removeItem, clearCart, replaceCart, totalCount, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
