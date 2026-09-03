// سياق المصادقة: يتابع حالة تسجيل الدخول عبر Google، ويحدد إن كان يجب إكمال الملف الشخصي
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User as FirebaseUser } from 'firebase/auth'
import { completeUserProfile, fetchUserProfile, signInWithGoogle, signOut, watchAuthState } from '../services/authService'
import type { AppUser } from '../types'

interface AuthContextValue {
  firebaseUser: FirebaseUser | null
  profile: AppUser | null
  loading: boolean
  /** صحيح عندما يكون المستخدم مسجّلاً بجوجل لكن لم يحفظ اسمه ورقم هاتفه بعد */
  needsProfileCompletion: boolean
  signIn: () => Promise<void>
  logOut: () => Promise<void>
  completeProfile: (displayName: string, phone: string) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [profile, setProfile] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = watchAuthState(async (user) => {
      setFirebaseUser(user)
      if (user) {
        const p = await fetchUserProfile(user.uid)
        setProfile(p)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function refreshProfile() {
    if (!firebaseUser) return
    const p = await fetchUserProfile(firebaseUser.uid)
    setProfile(p)
  }

  async function signIn() {
    await signInWithGoogle()
  }

  async function logOut() {
    await signOut()
  }

  async function completeProfile(displayName: string, phone: string) {
    if (!firebaseUser) return
    await completeUserProfile(firebaseUser.uid, {
      displayName,
      phone,
      photoURL: firebaseUser.photoURL || '',
      email: firebaseUser.email || '',
    })
    await refreshProfile()
  }

  const needsProfileCompletion = Boolean(firebaseUser && !loading && (!profile || !profile.phone))

  return (
    <AuthContext.Provider
      value={{ firebaseUser, profile, loading, needsProfileCompletion, signIn, logOut, completeProfile, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
