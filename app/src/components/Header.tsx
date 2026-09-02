import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useOpenHours } from '../hooks/useOpenHours'
import AuthSheet from './AuthSheet'

export default function Header() {
  const { firebaseUser, profile, logOut } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { isOpen, openHour, closeHour } = useOpenHours()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <header className="bg-sand-50/95 dark:bg-neutral-900/95 backdrop-blur">
      <div className="flex items-center gap-3 px-4 pt-3">
        <img src="/images/logo.svg" alt="شعار المطعم" className="w-11 h-11 rounded-full shadow-card" />
        <div className="flex-1 min-w-0">
          <h1 className="font-extrabold text-lg text-brick-600 dark:text-ember-400 truncate">مناقيش دير الزور</h1>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">مناقيش، بيتزا، فطائر وحلويات</p>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="تبديل الوضع الليلي"
          className="w-11 h-11 grid place-items-center rounded-full bg-white dark:bg-neutral-800 shadow-card text-lg"
        >
          {isDark ? '☀️' : '🌙'}
        </button>

        {firebaseUser ? (
          <button onClick={() => logOut()} className="w-11 h-11 rounded-full overflow-hidden shadow-card shrink-0" aria-label="حسابي">
            {profile?.photoURL || firebaseUser.photoURL ? (
              <img src={profile?.photoURL || firebaseUser.photoURL || ''} alt="صورة الحساب" className="w-full h-full object-cover" />
            ) : (
              <span className="grid place-items-center w-full h-full bg-brick-500 text-white font-bold">
                {(profile?.displayName || firebaseUser.displayName || '؟').charAt(0)}
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="px-3 h-11 rounded-full bg-brick-500 text-white text-sm font-bold shadow-card whitespace-nowrap"
          >
            دخول
          </button>
        )}
      </div>

      <div
        className={`mx-4 mt-2 mb-2 rounded-xl px-3 py-2 text-xs font-bold text-center ${
          isOpen
            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
        }`}
      >
        🚚 التوصيل مجاني — الدوام من الساعة {openHour} صباحاً حتى {closeHour - 12} ظهراً
        {!isOpen && ' — المحل مغلق حالياً'}
      </div>

      {showAuth && <AuthSheet onClose={() => setShowAuth(false)} />}
    </header>
  )
}
