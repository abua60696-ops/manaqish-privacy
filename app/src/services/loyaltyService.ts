// إعدادات نقاط الولاء: قاعدة الكسب وجدول المكافآت — من Firestore إن وُجد، وإلا من الإعدادات المحلية
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'
import type { LoyaltySettings, PointsHistoryEntry, Redemption } from '../types'
import { withTimeout } from '../utils/withTimeout'

// الإعدادات المحلية الافتراضية — قابلة للتعديل من مستند settings/loyalty في Firestore دون إعادة نشر
export const LOCAL_LOYALTY_SETTINGS: LoyaltySettings = {
  syrianPoundsPerPoint: 100, // نقطة واحدة عن كل 100 ل.س
  rewards: [
    { id: 'free-drink', label: 'مشروب مجاني', pointsCost: 50 },
    { id: 'free-pastry', label: 'فطيرة مجانية', pointsCost: 100 },
    { id: 'free-medium-pizza', label: 'بيتزا وسط مجانية', pointsCost: 200 },
  ],
}

export function tierForPoints(points: number): 'برونزي' | 'فضي' | 'ذهبي' {
  if (points >= 500) return 'ذهبي'
  if (points >= 200) return 'فضي'
  return 'برونزي'
}

export async function fetchLoyaltySettings(): Promise<LoyaltySettings> {
  try {
    const snap = await withTimeout(getDoc(doc(db, 'settings', 'loyalty')))
    if (!snap.exists()) return LOCAL_LOYALTY_SETTINGS
    return snap.data() as LoyaltySettings
  } catch {
    return LOCAL_LOYALTY_SETTINGS
  }
}

export function calculatePointsEarned(totalSyp: number, settings: LoyaltySettings): number {
  return Math.floor(totalSyp / settings.syrianPoundsPerPoint)
}

function generateRedemptionCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export async function createRedemption(data: { uid: string; customerName: string; rewardLabel: string; pointsCost: number }) {
  const code = generateRedemptionCode()
  const payload: Omit<Redemption, 'id'> = {
    code,
    uid: data.uid,
    customerName: data.customerName,
    rewardLabel: data.rewardLabel,
    pointsCost: data.pointsCost,
    status: 'قيد الانتظار',
    createdAt: new Date(),
  }
  await addDoc(collection(db, 'redemptions'), payload)
  return code
}

export async function fetchPointsHistory(uid: string): Promise<PointsHistoryEntry[]> {
  try {
    const q = query(collection(db, 'users', uid, 'pointsHistory'), orderBy('date', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PointsHistoryEntry, 'id'>) }))
  } catch {
    return []
  }
}
