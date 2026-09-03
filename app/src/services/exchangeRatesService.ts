// جلب أسعار الصرف من settings/exchangeRates في Firestore، وإلا من الملف المحلي
import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'
import { LOCAL_EXCHANGE_RATES } from '../data/exchangeRates'
import type { ExchangeRates } from '../types'
import { withTimeout } from '../utils/withTimeout'

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    const snap = await withTimeout(getDoc(doc(db, 'settings', 'exchangeRates')))
    if (!snap.exists()) return LOCAL_EXCHANGE_RATES
    return { ...LOCAL_EXCHANGE_RATES, ...(snap.data() as Partial<ExchangeRates>) }
  } catch {
    return LOCAL_EXCHANGE_RATES
  }
}
