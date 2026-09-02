import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CategoryChips from '../components/CategoryChips'
import ProductCard from '../components/ProductCard'
import QuantityStepper from '../components/QuantityStepper'
import { ProductGridSkeleton } from '../components/Skeletons'
import { CURRENCY_LABELS, CURRENCY_SYMBOLS } from '../data/exchangeRates'
import { CATEGORY_ORDER } from '../data/menu'
import { fetchExchangeRates } from '../services/exchangeRatesService'
import { calculatePointsEarned, fetchLoyaltySettings } from '../services/loyaltyService'
import { fetchMenu } from '../services/menuService'
import { useOpenHours } from '../hooks/useOpenHours'
import { submitOrder } from '../services/orderService'
import { openWhatsAppGiftOrder } from '../services/whatsapp'
import { formatCurrency, formatMoney } from '../utils/format'
import type { Category, CartItem, CurrencyCode, ExchangeRates, OrderItemRecord, Product } from '../types'

export default function GiftOrderPage() {
  const { isOpen } = useOpenHours()
  const navigate = useNavigate()

  const [products, setProducts] = useState<Product[] | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORY_ORDER[0])
  const [giftItems, setGiftItems] = useState<CartItem[]>([])
  const [rates, setRates] = useState<ExchangeRates | null>(null)
  const [currency, setCurrency] = useState<CurrencyCode>('TRY')

  const [senderName, setSenderName] = useState('')
  const [senderPhone, setSenderPhone] = useState('')
  const [senderCountry, setSenderCountry] = useState('تركيا')
  const [receiverName, setReceiverName] = useState('')
  const [receiverPhone, setReceiverPhone] = useState('')
  const [receiverAddress, setReceiverAddress] = useState('')
  const [personalMessage, setPersonalMessage] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMenu().then(setProducts)
    fetchExchangeRates().then(setRates)
  }, [])

  const filtered = useMemo(() => (products || []).filter((p) => p.category === activeCategory), [products, activeCategory])

  function addGiftItem(item: Omit<CartItem, 'lineId'>) {
    setGiftItems((prev) => {
      const key = `${item.productId}-${item.variantLabel || ''}`
      const existing = prev.find((i) => `${i.productId}-${i.variantLabel || ''}` === key)
      if (existing) return prev.map((i) => (i.lineId === existing.lineId ? { ...i, quantity: i.quantity + item.quantity } : i))
      return [...prev, { ...item, lineId: `${key}-${Date.now()}` }]
    })
  }

  function removeGiftItem(lineId: string) {
    setGiftItems((prev) => prev.filter((i) => i.lineId !== lineId))
  }

  function setGiftQty(lineId: string, qty: number) {
    setGiftItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, quantity: qty } : i)).filter((i) => i.quantity > 0))
  }

  const total = giftItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
  const totalInCurrency = rates && currency !== 'SYP' ? total / rates[currency] : null

  async function handleSubmit() {
    setError('')
    if (!isOpen) {
      setError('المحل مغلق حالياً — الدوام من 7 صباحاً حتى 2 ظهراً')
      return
    }
    if (!senderName.trim() || !senderPhone.trim()) return setError('اسم ورقم المُرسِل إلزاميان')
    if (!receiverName.trim() || !receiverPhone.trim() || !receiverAddress.trim())
      return setError('بيانات المستلم (الاسم، الهاتف، العنوان) إلزامية')
    if (giftItems.length === 0) return setError('اختر صنفاً واحداً على الأقل')

    setSubmitting(true)
    try {
      const orderItems: OrderItemRecord[] = giftItems.map((i) => ({
        name: i.name,
        category: i.category,
        variant: i.variantLabel,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        subtotal: i.unitPrice * i.quantity,
      }))

      const loyaltySettings = await fetchLoyaltySettings()
      const pointsEarned = calculatePointsEarned(total, loyaltySettings)

      const { docId: _docId, orderId } = await submitOrder({
        customerName: senderName.trim(),
        customerPhone: senderPhone.trim(),
        customerUid: null,
        items: orderItems,
        total,
        address: receiverAddress.trim(),
        mapLink: null,
        notes: undefined,
        orderType: 'سفرة لأهلي',
        pointsEarned,
        senderName: senderName.trim(),
        senderPhone: senderPhone.trim(),
        senderCountry,
        receiverName: receiverName.trim(),
        receiverPhone: receiverPhone.trim(),
        receiverAddress: receiverAddress.trim(),
        personalMessage: personalMessage.trim() || undefined,
        currency,
        totalInCurrency: totalInCurrency ?? undefined,
      })

      openWhatsAppGiftOrder({
        orderId,
        senderName: senderName.trim(),
        senderPhone: senderPhone.trim(),
        senderCountry,
        receiverName: receiverName.trim(),
        receiverPhone: receiverPhone.trim(),
        receiverAddress: receiverAddress.trim(),
        items: orderItems,
        total,
        personalMessage: personalMessage.trim() || undefined,
      })

      navigate('/order-confirmation', { state: { orderId, docId: _docId } })
    } catch (err) {
      console.error(err)
      setError('حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-enter pb-40 px-4">
      <div className="bg-brick-50 dark:bg-neutral-800 rounded-2xl px-4 py-4 my-4 text-center">
        <h2 className="font-extrabold text-lg mb-1">✈️ سفرة لأهلي</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">اطلب وجبة لأهلك في دير الزور، ونحن نوصلها إليهم</p>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card p-4 space-y-3 mb-4">
        <h3 className="font-extrabold text-sm">بيانات المُرسِل</h3>
        <input
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder="اسم المُرسِل"
          className="w-full h-11 rounded-xl border border-black/10 dark:border-white/15 bg-transparent px-3 text-sm"
        />
        <div className="flex gap-2">
          <input
            value={senderPhone}
            onChange={(e) => setSenderPhone(e.target.value)}
            placeholder="رقم هاتف المُرسِل"
            dir="ltr"
            className="flex-1 h-11 rounded-xl border border-black/10 dark:border-white/15 bg-transparent px-3 text-sm"
          />
          <select
            value={senderCountry}
            onChange={(e) => setSenderCountry(e.target.value)}
            className="h-11 rounded-xl border border-black/10 dark:border-white/15 bg-transparent px-2 text-sm font-bold"
          >
            <option>تركيا</option>
            <option>ألمانيا</option>
            <option>أخرى</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card p-4 space-y-3 mb-4">
        <h3 className="font-extrabold text-sm">بيانات المستلم داخل دير الزور</h3>
        <input
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
          placeholder="اسم المستلم"
          className="w-full h-11 rounded-xl border border-black/10 dark:border-white/15 bg-transparent px-3 text-sm"
        />
        <input
          value={receiverPhone}
          onChange={(e) => setReceiverPhone(e.target.value)}
          placeholder="رقم هاتف المستلم"
          dir="ltr"
          className="w-full h-11 rounded-xl border border-black/10 dark:border-white/15 bg-transparent px-3 text-sm"
        />
        <textarea
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
          placeholder="عنوان المستلم داخل دير الزور"
          rows={2}
          className="w-full rounded-xl border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
        />
        <textarea
          value={personalMessage}
          onChange={(e) => setPersonalMessage(e.target.value)}
          placeholder="رسالة شخصية تُطبع وتُرفق مع الطلب (اختياري)"
          rows={2}
          className="w-full rounded-xl border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
        />
      </div>

      <h3 className="font-extrabold text-sm mb-2 px-1">اختر الأصناف</h3>
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card overflow-hidden mb-4">
        <CategoryChips categories={CATEGORY_ORDER} active={activeCategory} onSelect={setActiveCategory} />
        {products === null ? (
          <ProductGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 gap-3 p-3">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onAdd={addGiftItem} />
            ))}
          </div>
        )}
      </div>

      {giftItems.length > 0 && (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card p-4 mb-4 space-y-2">
          <h3 className="font-extrabold text-sm mb-1">الأصناف المختارة</h3>
          {giftItems.map((item) => (
            <div key={item.lineId} className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">
                  {item.name} {item.variantLabel && `— ${item.variantLabel}`}
                </p>
              </div>
              <QuantityStepper value={item.quantity} onChange={(v) => setGiftQty(item.lineId, v)} />
              <button onClick={() => removeGiftItem(item.lineId)} className="text-red-500 px-1">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card p-4 mb-4 space-y-3">
        <h3 className="font-extrabold text-sm">عملة العرض</h3>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          className="w-full h-11 rounded-xl border border-black/10 dark:border-white/15 bg-transparent px-3 text-sm font-bold"
        >
          {(Object.keys(CURRENCY_LABELS) as CurrencyCode[]).map((c) => (
            <option key={c} value={c}>
              {CURRENCY_LABELS[c]}
            </option>
          ))}
        </select>
        <div className="text-center py-2">
          <span className="font-extrabold text-lg text-brick-600 dark:text-ember-400">
            {formatMoney(total)}
            {totalInCurrency !== null && ` ≈ ${formatCurrency(totalInCurrency, CURRENCY_SYMBOLS[currency])}`}
          </span>
        </div>
      </div>

      {!isOpen && (
        <div className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-xl px-4 py-3 mb-4 text-sm font-bold text-center">
          المحل مغلق حالياً — الدوام من 7 صباحاً حتى 2 ظهراً
        </div>
      )}
      {error && <p className="text-red-600 text-sm text-center font-bold mb-4">{error}</p>}

      <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-neutral-900 border-t border-black/5 dark:border-white/10 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <button
          onClick={handleSubmit}
          disabled={submitting || !isOpen}
          className="w-full h-14 rounded-xl bg-brick-500 text-white font-extrabold text-base disabled:opacity-50"
        >
          {submitting ? 'جارٍ الإرسال...' : 'إرسال طلب السفرة عبر واتساب'}
        </button>
      </div>
    </div>
  )
}
