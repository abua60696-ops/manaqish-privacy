import { useLocation, useNavigate } from 'react-router-dom'

interface ConfirmationState {
  orderId: string
  docId: string
}

export default function OrderConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as ConfirmationState | undefined

  if (!state) {
    return (
      <div className="page-enter flex flex-col items-center justify-center py-24 px-6 text-center gap-3">
        <p className="font-extrabold">لا توجد بيانات طلب لعرضها</p>
        <button onClick={() => navigate('/menu')} className="h-12 px-6 rounded-xl bg-brick-500 text-white font-extrabold">
          العودة إلى القائمة
        </button>
      </div>
    )
  }

  return (
    <div className="page-enter flex flex-col items-center justify-center py-20 px-6 text-center gap-4">
      <span className="text-6xl">✅</span>
      <h2 className="font-extrabold text-2xl">شكراً لطلبك!</h2>
      <p className="text-neutral-500 dark:text-neutral-400">تم إرسال طلبك بنجاح وسيصلك قريباً بإذن الله</p>
      <div className="bg-brick-50 dark:bg-neutral-800 rounded-2xl px-8 py-4">
        <span className="text-xs font-bold text-neutral-500 block mb-1">رقم طلبك</span>
        <span className="text-3xl font-extrabold text-brick-600 dark:text-ember-400">{state.orderId}</span>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-xs mt-4">
        <button
          onClick={() => navigate(`/track/${state.docId}`)}
          className="h-14 rounded-xl bg-brick-500 text-white font-extrabold text-base"
        >
          تتبع طلبي
        </button>
        <button onClick={() => navigate('/menu')} className="h-12 rounded-xl bg-sand-100 dark:bg-neutral-800 font-extrabold text-sm">
          العودة إلى القائمة
        </button>
      </div>
    </div>
  )
}
