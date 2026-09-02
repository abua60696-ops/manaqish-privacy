import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import GoogleSignInButton from './GoogleSignInButton'

export default function AuthSheet({ onClose }: { onClose: () => void }) {
  const { signIn } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleSignIn() {
    setBusy(true)
    setError('')
    try {
      await signIn()
      onClose()
    } catch {
      setError('تعذّر تسجيل الدخول، حاول مرة أخرى')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="w-full sm:max-w-sm bg-white dark:bg-neutral-800 rounded-t-3xl sm:rounded-3xl p-6 page-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-black/10 dark:bg-white/20 rounded-full mx-auto mb-5 sm:hidden" />
        <h2 className="text-xl font-extrabold text-center mb-2">أهلاً بك 👋</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mb-6">
          سجّل دخولك بحساب Google لتحصل على بطاقة النقاط وسجل طلباتك، أو تابع كضيف عند الطلب مباشرة.
        </p>
        <GoogleSignInButton onClick={handleSignIn} busy={busy} />
        {error && <p className="text-red-600 text-sm text-center mt-3">{error}</p>}
        <button onClick={onClose} className="w-full text-center text-sm font-bold text-neutral-500 mt-4">
          متابعة كضيف
        </button>
      </div>
    </div>
  )
}
