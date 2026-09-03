import { useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ProfileCompletionModal() {
  const { firebaseUser, completeProfile } = useAuth()
  const [name, setName] = useState(firebaseUser?.displayName || '')
  const [phone, setPhone] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      setError('الاسم الكامل ورقم الهاتف إلزاميان')
      return
    }
    setBusy(true)
    try {
      await completeProfile(name.trim(), phone.trim())
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white dark:bg-neutral-800 rounded-3xl p-6 space-y-4 page-enter">
        <h2 className="text-lg font-extrabold text-center">أكمل بياناتك</h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
          نحتاج اسمك ورقم هاتفك لإتمام طلباتك ومنحك بطاقة النقاط
        </p>
        <div>
          <label className="text-xs font-bold text-neutral-500">الاسم الكامل</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-12 rounded-xl border border-black/10 dark:border-white/15 bg-transparent px-3 mt-1 text-sm"
            placeholder="مثال: أحمد محمد"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-neutral-500">رقم الهاتف</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            type="tel"
            className="w-full h-12 rounded-xl border border-black/10 dark:border-white/15 bg-transparent px-3 mt-1 text-sm"
            placeholder="09xxxxxxxx"
            dir="ltr"
          />
        </div>
        {error && <p className="text-red-600 text-xs text-center">{error}</p>}
        <button disabled={busy} className="w-full h-12 rounded-xl bg-brick-500 text-white font-extrabold text-sm disabled:opacity-60">
          {busy ? 'جارٍ الحفظ...' : 'حفظ ومتابعة'}
        </button>
      </form>
    </div>
  )
}
