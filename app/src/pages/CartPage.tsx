import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatMoney } from '../utils/format'
import QuantityStepper from '../components/QuantityStepper'

export default function CartPage() {
  const { items, increment, decrement, removeItem, clearCart, totalPrice } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="page-enter flex flex-col items-center justify-center py-24 px-6 text-center gap-3">
        <span className="text-5xl">🛒</span>
        <p className="font-extrabold text-lg">سلتك فارغة</p>
        <p className="text-sm text-neutral-500">تصفّح القائمة وأضف ما يعجبك</p>
        <button onClick={() => navigate('/menu')} className="mt-3 h-12 px-6 rounded-xl bg-brick-500 text-white font-extrabold">
          الذهاب إلى القائمة
        </button>
      </div>
    )
  }

  return (
    <div className="page-enter pb-40 px-4">
      <div className="flex items-center justify-between py-4">
        <h2 className="font-extrabold text-lg">سلتي</h2>
        <button onClick={clearCart} className="text-xs font-bold text-red-500">
          مسح السلة
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.lineId} className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card p-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-sm truncate">{item.name}</p>
              {item.variantLabel && <p className="text-xs text-neutral-500">{item.variantLabel}</p>}
              {item.variantBadge && <p className="text-[10px] font-bold text-ember-600 dark:text-ember-400">{item.variantBadge}</p>}
              <p className="text-brick-600 dark:text-ember-400 font-extrabold text-sm mt-1">{formatMoney(item.unitPrice * item.quantity)}</p>
            </div>
            <QuantityStepper value={item.quantity} onChange={(v) => (v > item.quantity ? increment(item.lineId) : decrement(item.lineId))} />
            <button onClick={() => removeItem(item.lineId)} className="text-red-500 text-lg px-1" aria-label="حذف الصنف">
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold rounded-xl px-3 py-2.5 mt-4 text-center">
        🚚 التوصيل مجاني على هذا الطلب
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-neutral-900 border-t border-black/5 dark:border-white/10 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-3 font-extrabold">
          <span>الإجمالي</span>
          <span className="text-brick-600 dark:text-ember-400">{formatMoney(totalPrice)}</span>
        </div>
        <button onClick={() => navigate('/checkout')} className="w-full h-14 rounded-xl bg-brick-500 text-white font-extrabold text-base">
          إتمام الطلب
        </button>
      </div>
    </div>
  )
}
