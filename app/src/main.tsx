import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)

// نتحقق من وجود مفاتيح Firebase قبل تحميل بقية التطبيق — حتى لا تظهر شاشة بيضاء
// بلا تفسير في حال نسي أحدهم إنشاء ملف .env (راجع README.md)
const REQUIRED_ENV_VARS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
] as const

const missing = REQUIRED_ENV_VARS.filter((key) => !import.meta.env[key])

function SetupNotice({ missing }: { missing: readonly string[] }) {
  return (
    <div dir="rtl" style={{ fontFamily: 'Cairo, Tajawal, sans-serif', padding: 24, maxWidth: 480, margin: '40px auto', lineHeight: 1.8 }}>
      <h1 style={{ color: '#B5442E' }}>⚠️ إعداد Firebase غير مكتمل</h1>
      <p>يجب إنشاء ملف .env في مجلد المشروع وتعبئة مفاتيح Firebase قبل تشغيل التطبيق.</p>
      <p>المتغيرات الناقصة:</p>
      <ul>
        {missing.map((m) => (
          <li key={m} style={{ fontFamily: 'monospace' }}>
            {m}
          </li>
        ))}
      </ul>
      <p>انسخ ملف .env.example باسم .env وضع فيه القيم من إعدادات مشروعك في Firebase Console. راجع README.md لشرح الخطوات كاملة.</p>
    </div>
  )
}

if (missing.length > 0) {
  root.render(<SetupNotice missing={missing} />)
} else {
  import('./App').then(({ default: App }) => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
}
