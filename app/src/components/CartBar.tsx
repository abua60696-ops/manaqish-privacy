import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatMoney } from '../utils/format'

export default function CartBar() {
  const { totalCount, totalPrice } = useCart()
  const navigate = useNavigate()

  if (totalCount === 0) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <button
        onClick={() => navigate('/cart')}
        className="w-full max-w-lg mx-auto flex items-center justify-between gap-3 bg-brick-500 text-white rounded-2xl h-14 px-5 shadow-xl active:bg-brick-600"
      >
        <span className="flex items-center gap-2 font-extrabold text-sm">
          <span className="w-6 h-6 grid place-items-center bg-white/20 rounded-full text-xs">{totalCount}</span>
          عرض السلة
        </span>
        <span className="font-extrabold">{formatMoney(totalPrice)}</span>
      </button>
    </div>
  )
}
