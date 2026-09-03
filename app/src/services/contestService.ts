// المسابقات: جلبها، والمشاركة فيها، ومنع تكرار مشاركة نفس المستخدم
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from './firebase'
import type { Contest, ContestEntry } from '../types'
import { withTimeout } from '../utils/withTimeout'

export async function fetchContests(): Promise<Contest[]> {
  try {
    const snap = await withTimeout(getDocs(collection(db, 'contests')))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Contest, 'id'>) }))
  } catch {
    return []
  }
}

export async function hasUserEntered(contestId: string, uid: string): Promise<boolean> {
  const q = query(collection(db, 'contestEntries'), where('contestId', '==', contestId), where('uid', '==', uid))
  const snap = await getDocs(q)
  return !snap.empty
}

export async function joinContest(entry: Omit<ContestEntry, 'id' | 'createdAt'>) {
  const already = await hasUserEntered(entry.contestId, entry.uid)
  if (already) throw new Error('لقد شاركت في هذه المسابقة من قبل')
  await addDoc(collection(db, 'contestEntries'), { ...entry, createdAt: new Date() })
}
