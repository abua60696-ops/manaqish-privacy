import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useOpenHours } from '../hooks/useOpenHours'
import AddressPicker from '../components/AddressPicker'
import { getGuestInfo, saveGuestInfo, updateLastAddress } from '../services/authService'
import { calculatePointsEarned, fetchLoyaltySettings } from '../services/loyaltyService'
import { submitOrder } from '../services/orderService'
import { openWhatsAppOrder } from '../services/whatsapp'
import { formatMoney } from '../utils/format'
import type { OrderItemRecord } from '../types'

export default function CheckoutPage() {
  const { firebaseUser, profile, refreshProfile } = useAuth()
  const { items, totalPrice, clearCart } = useCart()
  const { isOpen } = useOpenHours()
  const navigate = useNavigate()

  const guest = getGuestInfo()
  const [name, setName] = useState(profile?.displayName || firebaseUser?.displayName || guest?.name || '')
  const [phone, setPhone] = useState(profile?.phone || guest?.phone || '')
  const [address, setAddress] = useState(profile?.lastAddress || guest?.address || '')
  const [mapLink, setMapLink] = useState<string | null>(profile?.lastMapLink || guest?.mapLink || null)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (items.length === 0) navigate('/cart', { replace: true })
  }, [items.length, navigate])

  const previousAddress =
    (profile?.lastAddress && { address: profile.lastAddress, mapLink: profile.lastMapLink ?? null }) ||
    (guest?.address && { address: guest.address, mapLink: guest.mapLink ?? null }) ||
    null

  async function handleSubmit() {
    setError('')
    if (!isOpen) {
      setError('عذراً، المحل مغلق حالياً. يمكنك تصفّح القائمة والعودة خلال أوقات الدوام.')
      return
    }
    if (!name.trim() || !phone.trim()) {
      setError('الاسم ورقم الهاتف إلزاميان')
      return
    }
    if (!address.trim()) {
      setError('يرجى إدخال عنوان التوصيل')
      return
    }

    setSubmitting(true)
    try {
      const orderItems: OrderItemRecord[] = items.map((i) => ({
        name: i.name,
        category: i.category,
        variant: i.variantLabel,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        subtotal: i.unitPrice * i.quantity,
      }))

      const loyaltySettings = await fetchLoyaltySettings()
      const pointsEarned = calculatePointsEarned(totalPrice, loyaltySettings)

      const { docId, orderId } = await submitOrder({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerUid: firebaseUser?.uid || null,
        items: orderItems,
        total: totalPrice,
        address: address.trim(),
        mapLink,
        notes: notes.trim() || undefined,
        orderType: 'عادي',
        pointsEarned,
      })

      openWhatsAppOrder({
        orderId,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        items: orderItems,
        total: totalPrice,
        address: address.trim(),
        mapLink,
        notes: notes.trim() || undefined,
      })

      if (firebaseUser) {
        await updateLastAddress(firebaseUser.uid, address.trim(), mapLink)
        await refreshProfile()
      } else {
        saveGuestInfo({ name: name.trim(), phone: phone.trim(), address: address.trim(), mapLink })
      }

      clearCart()
      navigate('/order-confirmation', { state: { orderId, docId } })
    } catch (err) {
      console.error(err)
      setError('حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-enter pb-32 px-4">
      <h2 className="font-extrabold text-lg py-4">إتمام الطلب</h2>

      {!isOpen && (
        <div className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 rounded-xl px-4 py-3 mb-4 text-sm font-bold text-center">
          المحل مغلق حالياً. الدوام من الساعة 7 صباحاً حتى 2 ظهراً. يمكنك تصفّح القائمة لكن لا يمكن إرسال الطلب الآن.
        </div>
      )}

      {!firebaseUser && (
        <div className="bg-sand-100 dark:bg-neutral-800 rounded-xl px-4 py-3 mb-4 text-xs text-neutral-600 dark:text-neutral-300">
          تطلب الآن كضيف. سجّل دخولك بحساب Google للحصول على بطاقة نقاط وسجل طلبات محفوظ.
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold text-neutral-500">الاسم الكامل</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-12 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-800 px-3 mt-1 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-neutral-500">رقم الهاتف</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            dir="ltr"
            className="w-full h-12 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-800 px-3 mt-1 text-sm"
          />
        </div>

        <AddressPicker
          address={address}
          onAddressChange={setAddress}
          mapLink={mapLink}
          onMapLinkChange={setMapLink}
          previousAddress={previousAddress}
        />

        <div>
          <label className="text-xs font-bold text-neutral-500">ملاحظات (اختياري)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="مثال: بدون بصل، جرس معطل"
            className="w-full rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-800 px-3 py-2.5 mt-1 text-sm"
          />
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold rounded-xl px-3 py-2.5 text-center">
          🚚 التوصيل مجاني
        </div>

        {error && <p className="text-red-600 text-sm text-center font-bold">{error}</p>}
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white dark:bg-neutral-900 border-t border-black/5 dark:border-white/10 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between mb-3 font-extrabold">
          <span>الإجمالي</span>
          <span className="text-brick-600 dark:text-ember-400">{formatMoney(totalPrice)}</span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting || !isOpen}
          className="w-full h-14 rounded-xl bg-brick-500 text-white font-extrabold text-base disabled:opacity-50"
        >
          {submitting ? 'جارٍ إرسال الطلب...' : 'إرسال الطلب عبر واتساب'}
        </button>
      </div>
    </div>
  )
}
