// إنشاء الطلبات ومتابعتها الحية في Firestore
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { db } from './firebase'
import type { OrderRecord, OrderStatus } from '../types'

/** رقم الطلب اليومي المقروء مثل #014 — يُعاد العدّاد يومياً حسب تاريخ اليوم */
async function nextDailyOrderId(): Promise<string> {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const counterRef = doc(db, 'counters', today)
  const next = await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef)
    const current = snap.exists() ? (snap.data().count as number) : 0
    const value = current + 1
    tx.set(counterRef, { count: value }, { merge: true })
    return value
  })
  return `#${String(next).padStart(3, '0')}`
}

export async function submitOrder(order: Omit<OrderRecord, 'orderId' | 'status' | 'createdAt'>) {
  const orderId = await nextDailyOrderId()
  const payload: Omit<OrderRecord, 'id'> = {
    ...order,
    orderId,
    status: 'جديد',
    createdAt: serverTimestamp(),
  }
  const ref = await addDoc(collection(db, 'orders'), payload)
  return { docId: ref.id, orderId }
}

export function watchOrder(docId: string, callback: (order: (OrderRecord & { id: string }) | null) => void) {
  return onSnapshot(doc(db, 'orders', docId), (snap) => {
    if (!snap.exists()) return callback(null)
    callback({ id: snap.id, ...(snap.data() as Omit<OrderRecord, 'id'>) })
  })
}

export async function fetchUserOrders(uid: string) {
  const q = query(collection(db, 'orders'), where('customerUid', '==', uid), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<OrderRecord, 'id'>) }))
}

export const ORDER_STAGES: OrderStatus[] = ['جديد', 'قيد التحضير', 'خرج للتوصيل', 'تم التسليم']
