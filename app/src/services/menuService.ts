// جلب القائمة: من Firestore أولاً، وإن تعذّر ذلك (لا إنترنت، أو المجموعة فارغة) نستخدم الملف المحلي
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import { LOCAL_MENU } from '../data/menu'
import type { Product } from '../types'
import { withTimeout } from '../utils/withTimeout'

export async function fetchMenu(): Promise<Product[]> {
  try {
    const snap = await withTimeout(getDocs(collection(db, 'menu')))
    if (snap.empty) return LOCAL_MENU
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, 'id'>) }))
  } catch {
    // لا يوجد إنترنت أو تعذّر الوصول إلى Firestore — نعرض النسخة المحلية بدل شاشة فارغة
    return LOCAL_MENU
  }
}
