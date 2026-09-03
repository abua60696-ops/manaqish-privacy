import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Countdown from '../components/Countdown'
import GoogleSignInButton from '../components/GoogleSignInButton'
import { CardSkeleton } from '../components/Skeletons'
import { fetchContests, hasUserEntered, joinContest } from '../services/contestService'
import type { Contest } from '../types'

function ContestCard({ contest }: { contest: Contest }) {
  const { firebaseUser, signIn } = useAuth()
  const [answer, setAnswer] = useState('')
  const [entered, setEntered] = useState(false)
  const [checking, setChecking] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!firebaseUser) {
      setChecking(false)
      return
    }
    hasUserEntered(contest.id, firebaseUser.uid).then((v) => {
      setEntered(v)
      setChecking(false)
    })
  }, [contest.id, firebaseUser])

  async function handleJoin() {
    if (!firebaseUser) {
      await signIn()
      return
    }
    if (contest.kind === 'سؤال' && !answer.trim()) {
      setMessage('يرجى كتابة إجابتك أولاً')
      return
    }
    setBusy(true)
    setMessage('')
    try {
      await joinContest({
        contestId: contest.id,
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || 'مستخدم',
        answer: contest.kind === 'سؤال' ? answer.trim() : undefined,
      })
      setEntered(true)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-card overflow-hidden">
      {contest.image && <img src={contest.image} alt={contest.title} className="w-full aspect-video object-cover" />}
      <div className="p-4 space-y-3">
        <h3 className="font-extrabold text-lg">{contest.title}</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-300">{contest.description}</p>
        <p className="text-sm font-bold text-ember-600 dark:text-ember-400">🎁 الجائزة: {contest.prize}</p>
        <Countdown target={contest.endDate} />

        {contest.kind === 'سؤال' && !entered && (
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={contest.question || 'اكتب إجابتك هنا'}
            rows={2}
            className="w-full rounded-xl border border-black/10 dark:border-white/15 bg-transparent px-3 py-2 text-sm"
          />
        )}

        {!checking &&
          (entered ? (
            <p className="text-center font-extrabold text-green-600 py-2">✓ تمت مشاركتك في هذه المسابقة</p>
          ) : !firebaseUser ? (
            <GoogleSignInButton onClick={handleJoin} busy={busy} />
          ) : (
            <button onClick={handleJoin} disabled={busy} className="w-full h-12 rounded-xl bg-brick-500 text-white font-extrabold text-sm">
              {busy ? 'جارٍ الإرسال...' : 'شارك في المسابقة'}
            </button>
          ))}
        {message && <p className="text-red-600 text-xs text-center">{message}</p>}
      </div>
    </div>
  )
}

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[] | null>(null)

  useEffect(() => {
    fetchContests().then(setContests)
  }, [])

  const now = Date.now()
  const active = useMemo(() => (contests || []).filter((c) => c.isActive && new Date(c.endDate).getTime() > now), [contests, now])
  const past = useMemo(() => (contests || []).filter((c) => !c.isActive || new Date(c.endDate).getTime() <= now), [contests, now])

  return (
    <div className="page-enter pb-16 px-4">
      <h2 className="font-extrabold text-lg py-4">المسابقات</h2>

      {contests === null ? (
        <div className="space-y-4">
          <CardSkeleton />
        </div>
      ) : active.length === 0 ? (
        <p className="text-center text-neutral-500 py-10">لا توجد مسابقة حالياً — ترقّبوا القادم 🎉</p>
      ) : (
        <div className="space-y-4">
          {active.map((c) => (
            <ContestCard key={c.id} contest={c} />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="mt-8">
          <h3 className="font-extrabold mb-3">المسابقات السابقة والفائزون</h3>
          <div className="space-y-2">
            {past.map((c) => (
              <div key={c.id} className="bg-sand-100 dark:bg-neutral-800 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-bold">{c.title}</span>
                <span className="text-xs font-bold text-brick-600 dark:text-ember-400">
                  {c.winnerName ? `🏆 ${c.winnerName}` : 'لم يُعلن الفائز بعد'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
