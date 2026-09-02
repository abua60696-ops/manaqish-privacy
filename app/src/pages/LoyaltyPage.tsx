import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { createRedemption, fetchLoyaltySettings, fetchPointsHistory, tierForPoints } from '../services/loyaltyService'
import type { LoyaltySettings, PointsHistoryEntry } from '../types'

const TIER_STYLES: Record<string, string> = {
  برونزي: 'from-amber-700 to-amber-900',
  فضي: 'from-slate-400 to-slate-600',
  ذهبي: 'from-yellow-400 to-yellow-600',
}

export default function LoyaltyPage() {
  const { firebaseUser, profile, signIn } = useAuth()
  const [settings, setSettings] = useState<LoyaltySettings | null>(null)
  const [history, setHistory] = useState<PointsHistoryEntry[]>([])
  const [redeemCode, setRedeemCode] = useState<string | null>(null)
  const [busyRewardId, setBusyRewardId] = useState<string | null>(null)

  useEffect(() => {
    fetchLoyaltySettings().then(setSettings)
  }, [])

  useEffect(() => {
    if (firebaseUser) fetchPointsHistory(firebaseUser.uid).then(setHistory)
  }, [firebaseUser])

  if (!firebaseUser) {
    return (
      <div className="page-enter flex flex-col items-center justify-center py-20 px-6 text-center gap-4">
        <span className="text-5xl">⭐</span>
        <p className="font-extrabold">بطاقة النقاط للأعضاء المسجّلين</p>
        <p className="text-sm text-neutral-500">سجّل دخولك بحساب Google لتحصل على بطاقة نقاط واكسب نقاطاً مع كل طلب</p>
        <div className="w-full max-w-xs">
          <GoogleSignInButton onClick={signIn} />
        </div>
      </div>
    )
  }

  const points = profile?.points ?? 0
  const tier = tierForPoints(points)

  async function handleRedeem(rewardId: string, label: string, cost: number) {
    if (!firebaseUser || !profile) return
    if (points < cost) return
    setBusyRewardId(rewardId)
    try {
      const code = await createRedemption({ uid: firebaseUser.uid, customerName: profile.displayName, rewardLabel: label, pointsCost: cost })
      setRedeemCode(code)
    } finally {
      setBusyRewardId(null)
    }
  }

  return (
    <div className="page-enter pb-16 px-4">
      <h2 className="font-extrabold text-lg py-4">بطاقة النقاط</h2>

      <div className={`bg-gradient-to-br ${TIER_STYLES[tier]} text-white rounded-3xl p-6 shadow-xl`}>
        <div className="flex items-center gap-4">
          <img
            src={profile?.photoURL || firebaseUser.photoURL || '/images/logo.svg'}
            alt="صورة الحساب"
            className="w-16 h-16 rounded-full border-2 border-white/60 object-cover"
          />
          <div>
            <p className="font-extrabold text-lg">{profile?.displayName || firebaseUser.displayName}</p>
            <span className="inline-block mt-1 text-[11px] font-bold bg-white/20 px-2.5 py-1 rounded-full">مستوى {tier}</span>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-4xl font-extrabold">{points}</p>
          <p className="text-xs mt-1 opacity-90">نقطة</p>
        </div>
      </div>

      <p className="text-center text-xs text-neutral-500 mt-3">
        برونزي 0–199 • فضي 200–499 • ذهبي 500+ — تكسب نقطة عن كل {settings?.syrianPoundsPerPoint ?? 100} ل.س
      </p>

      <h3 className="font-extrabold mt-8 mb-3">استبدل نقاطك</h3>
      <div className="space-y-3">
        {(settings?.rewards || []).map((reward) => (
          <div key={reward.id} className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-extrabold text-sm">{reward.label}</p>
              <p className="text-xs text-neutral-500">{reward.pointsCost} نقطة</p>
            </div>
            <button
              onClick={() => handleRedeem(reward.id, reward.label, reward.pointsCost)}
              disabled={points < reward.pointsCost || busyRewardId === reward.id}
              className="h-10 px-4 rounded-lg bg-brick-500 text-white text-xs font-extrabold disabled:opacity-40"
            >
              {busyRewardId === reward.id ? '...' : 'استبدال'}
            </button>
          </div>
        ))}
      </div>

      <h3 className="font-extrabold mt-8 mb-3">سجل حركة النقاط</h3>
      {history.length === 0 ? (
        <p className="text-sm text-neutral-500 text-center py-8">لا يوجد سجل حركة نقاط بعد</p>
      ) : (
        <div className="space-y-2">
          {history.map((h) => (
            <div key={h.id} className="bg-white dark:bg-neutral-800 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-bold">{h.reason}</span>
              <span className={`text-sm font-extrabold ${h.points >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {h.points >= 0 ? '+' : ''}
                {h.points}
              </span>
            </div>
          ))}
        </div>
      )}

      {redeemCode && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setRedeemCode(null)}>
          <div className="bg-white dark:bg-neutral-800 rounded-3xl p-6 text-center max-w-xs w-full" onClick={(e) => e.stopPropagation()}>
            <p className="font-extrabold mb-2">كود الاستبدال الخاص بك</p>
            <p className="text-4xl font-extrabold tracking-widest text-brick-600 dark:text-ember-400 my-4">{redeemCode}</p>
            <p className="text-xs text-neutral-500 mb-4">أعطِ هذا الكود للموظف عند استلام مكافأتك، وسيتم اعتماده من إدارة المطعم</p>
            <button onClick={() => setRedeemCode(null)} className="w-full h-12 rounded-xl bg-brick-500 text-white font-extrabold text-sm">
              حسناً
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
