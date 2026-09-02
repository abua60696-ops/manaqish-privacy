export default function GoogleSignInButton({ onClick, busy }: { onClick: () => void; busy?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className="w-full flex items-center justify-center gap-3 h-14 rounded-2xl bg-white dark:bg-neutral-700 border-2 border-neutral-200 dark:border-neutral-600 font-extrabold text-base shadow-card disabled:opacity-60"
    >
      <svg width="22" height="22" viewBox="0 0 48 48">
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
        />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path
          fill="#4CAF50"
          d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.4C29.6 35.6 27 36.5 24 36.5c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.6 39.6 16.3 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.6 5.4C41.4 36 44 30.6 44 24c0-1.3-.1-2.7-.4-3.5z"
        />
      </svg>
      {busy ? 'جارٍ تسجيل الدخول...' : 'الدخول بحساب Google'}
    </button>
  )
}
