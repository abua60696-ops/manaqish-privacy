import { useState } from 'react'
import { DEIR_EZ_ZOR_DISTRICTS } from '../data/districts'

interface AddressPickerProps {
  address: string
  onAddressChange: (v: string) => void
  mapLink: string | null
  onMapLinkChange: (v: string | null) => void
  previousAddress?: { address: string; mapLink: string | null } | null
}

export default function AddressPicker({ address, onAddressChange, mapLink, onMapLinkChange, previousAddress }: AddressPickerProps) {
  const [locating, setLocating] = useState(false)
  const [locError, setLocError] = useState('')

  function handleDistrictSelect(district: string) {
    if (!district || district.startsWith('أخرى')) return
    if (!address.includes(district)) {
      onAddressChange(address ? `${district} — ${address}` : district)
    }
  }

  function handleAutoLocate() {
    if (!navigator.geolocation) {
      setLocError('المتصفح لا يدعم تحديد الموقع')
      return
    }
    setLocating(true)
    setLocError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        onMapLinkChange(`https://maps.google.com/?q=${latitude},${longitude}`)
        setLocating(false)
      },
      () => {
        setLocError('تعذّر الوصول إلى موقعك — تأكد من إذن الموقع')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  return (
    <div className="space-y-3">
      {previousAddress && (
        <button
          type="button"
          onClick={() => {
            onAddressChange(previousAddress.address)
            onMapLinkChange(previousAddress.mapLink)
          }}
          className="w-full h-12 rounded-xl border-2 border-brick-500 text-brick-600 dark:text-ember-400 font-extrabold text-sm"
        >
          📍 نفس العنوان السابق
        </button>
      )}

      <select
        onChange={(e) => handleDistrictSelect(e.target.value)}
        defaultValue=""
        className="w-full h-12 rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-800 px-3 text-sm font-bold"
      >
        <option value="" disabled>
          اختر الحي أو المنطقة (اختياري)
        </option>
        {DEIR_EZ_ZOR_DISTRICTS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <textarea
        value={address}
        onChange={(e) => onAddressChange(e.target.value)}
        placeholder="اكتب عنوانك بالتفصيل: الحي، الشارع، أقرب معلم..."
        rows={2}
        className="w-full rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-800 px-3 py-2.5 text-sm"
      />

      <button
        type="button"
        onClick={handleAutoLocate}
        disabled={locating}
        className="w-full h-12 rounded-xl bg-sand-100 dark:bg-neutral-700 font-extrabold text-sm flex items-center justify-center gap-2"
      >
        {locating ? 'جارٍ تحديد موقعك...' : '📌 حدد موقعي تلقائياً (اختياري)'}
      </button>

      {mapLink && <p className="text-xs text-green-700 dark:text-green-400 font-bold">✓ تم إرفاق موقعك على الخريطة مع الطلب</p>}
      {locError && <p className="text-xs text-red-600">{locError}</p>}
    </div>
  )
}
