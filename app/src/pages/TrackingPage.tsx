import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import GoogleSignInButton from '../components/GoogleSignInButton'
import StatusStepper from '../components/StatusStepper'
import { fetchUserOrders, watchOrder } from '../services/orderService'
import { formatMoney } from '../utils/format'
import type { OrderRecord } from '../types'

export default function TrackingPage() {
  const { docId } = useParams<{ docId: string }>()
  const { firebaseUser, signIn } = useAuth()
  const { replaceCart } = useCart()
  const navigate = useNavigate()

  const [order, setOrder] = useState<(OrderRecord & { id: string }) | null>(null)
  const [history, setHistory] = useState<(OrderRecord & { id: string })[]>([])

  useEffect(() => {
    if (!firebaseUser || !docId) return
    const unsub = watchOrder(docId, setOrder)
    return unsub
  }, [firebaseUser, docId])

  useEffect(() => {
    if (!firebaseUser) return
    fetchUserOrders(firebaseUser.uid).then(setHistory)
  }, [firebaseUser])

  function handleReorder(o: OrderRecord) {
    replaceCart(
      o.items.map((item, i) => ({
        lineId: `${o.id}-${i}-${Date.now()}`,
        productId: `reorder-${item.name}-${item.variant || ''}`,
        name: item.name,
        category: item.category,
        variantLabel: item.variant,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    )
    navigate('/cart')
  }

  if (!firebaseUser) {
    return (
      <div className="page-enter flex flex-col items-center justify-center py-20 px-6 text-center gap-4">
        <span className="text-5xl">🔒</span>
        <p className="font-extrabold">تتبع الطلب المباشر متاح للأعضاء المسجّلين</p>
        <p className="text-sm text-neutral-500">سجّل دخولك بحساب Google لمتابعة حالة طلبك لحظة بلحظة وسجل طلباتك السابقة</p>
        <div className="w-full max-w-xs">
          <GoogleSignInButton onClick={signIn} />
        </div>
      </div>
    )
  }

  return (
    <div className="page-enter pb-16 px-4">
      {docId && (
        <div className="mt-4 bg-white dark:bg-neutral-800 rounded-2xl shadow-card p-5">
          {order ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <span className="font-extrabold text-lg">{order.orderId}</span>
                <span className="text-xs font-bold text-neutral-500">{formatMoney(order.total)}</span>
              </div>
              <StatusStepper status={order.status} />
            </>
          ) : (
            <p className="text-sm text-neutral-500 text-center py-6">جارٍ تحميل حالة الطلب...</p>
          )}
        </div>
      )}

      <h3 className="font-extrabold mt-8 mb-3">سجل طلباتي السابقة</h3>
      {history.length === 0 ? (
        <p className="text-sm text-neutral-500 text-center py-8">لا يوجد سجل طلبات بعد</p>
      ) : (
        <div className="space-y-3">
          {history.map((o) => (
            <div key={o.id} className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-sm">{o.orderId}</span>
                <span className="text-xs font-bold text-brick-600 dark:text-ember-400">{o.status}</span>
              </div>
              <p className="text-xs text-neutral-500 mb-3">
                {o.items.length} صنف — {formatMoney(o.total)}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/track/${o.id}`)}
                  className="flex-1 h-10 rounded-lg bg-sand-100 dark:bg-neutral-700 text-xs font-extrabold"
                >
                  عرض الحالة
                </button>
                <button onClick={() => handleReorder(o)} className="flex-1 h-10 rounded-lg bg-brick-500 text-white text-xs font-extrabold">
                  إعادة الطلب
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
