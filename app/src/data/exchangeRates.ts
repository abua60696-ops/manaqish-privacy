// ============================================================================
// أسعار الصرف المستخدمة في تبويب "سفرة لأهلي" لعرض السعر بعملة بلد المُرسِل
// عدّلها يدوياً هنا عند الحاجة، أو حدّث مستند settings/exchangeRates في Firestore
// حتى تتغيّر القيم دون إعادة نشر التطبيق — التطبيق يفضّل قيم Firestore إن وُجدت.
// القيمة تمثّل: كم ليرة سورية جديدة (ل.س) تساوي وحدة واحدة من هذه العملة.
// ============================================================================

import type { ExchangeRates } from '../types'

export const LOCAL_EXCHANGE_RATES: ExchangeRates = {
  TRY: 43, // 1 ليرة تركية ≈ 43 ل.س
  EUR: 1470, // 1 يورو ≈ 1470 ل.س
  USD: 1360, // 1 دولار أمريكي ≈ 1360 ل.س
  SYP: 1, // الليرة السورية هي العملة الأساس
}

export const CURRENCY_LABELS: Record<keyof ExchangeRates, string> = {
  TRY: 'ليرة تركية',
  EUR: 'يورو',
  USD: 'دولار أمريكي',
  SYP: 'ليرة سورية',
}

export const CURRENCY_SYMBOLS: Record<keyof ExchangeRates, string> = {
  TRY: '₺',
  EUR: '€',
  USD: '$',
  SYP: 'ل.س',
}
