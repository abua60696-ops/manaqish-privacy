// خدمات تسجيل الدخول: حساب Google أو الدخول كضيف
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db, googleProvider } from './firebase'
import type { AppUser } from '../types'

export function watchAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback)
}

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider)
  return result.user
}

export async function signOut() {
  await firebaseSignOut(auth)
}

export async function fetchUserProfile(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return { uid, ...(snap.data() as Omit<AppUser, 'uid'>) }
}

/** يُستدعى بعد أول تسجيل دخول لحفظ الاسم الكامل ورقم الهاتف (حقلان إجباريان) */
export async function completeUserProfile(uid: string, data: { displayName: string; phone: string; photoURL?: string; email?: string }) {
  const ref = doc(db, 'users', uid)
  await setDoc(
    ref,
    {
      displayName: data.displayName,
      phone: data.phone,
      photoURL: data.photoURL || '',
      email: data.email || '',
      role: 'customer',
      points: 0,
      createdAt: serverTimestamp(),
    },
    { merge: true },
  )
}

export async function updateLastAddress(uid: string, address: string, mapLink: string | null) {
  await updateDoc(doc(db, 'users', uid), { lastAddress: address, lastMapLink: mapLink })
}

// ---------------------------------------------------------------------------
// بيانات الضيف (بدون حساب) — تُحفظ محلياً على الجهاز لتسهيل الطلب القادم
// ---------------------------------------------------------------------------
const GUEST_KEY = 'manaqish_guest_v1'

export interface GuestInfo {
  name: string
  phone: string
  address?: string
  mapLink?: string | null
}

export function getGuestInfo(): GuestInfo | null {
  try {
    const raw = localStorage.getItem(GUEST_KEY)
    return raw ? (JSON.parse(raw) as GuestInfo) : null
  } catch {
    return null
  }
}

export function saveGuestInfo(info: GuestInfo) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(info))
}
