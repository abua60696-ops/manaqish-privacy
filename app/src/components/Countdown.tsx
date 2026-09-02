import { useEffect, useState } from 'react'

function getRemaining(target: string) {
  const diff = new Date(target).getTime() - Date.now()
  if (diff <= 0) return null
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
}

export default function Countdown({ target }: { target: string }) {
  const [remaining, setRemaining] = useState(() => getRemaining(target))

  useEffect(() => {
    const id = setInterval(() => setRemaining(getRemaining(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  if (!remaining) return <span className="text-sm font-bold text-red-500">انتهت المسابقة</span>

  return (
    <div className="flex gap-2 text-center">
      {[
        { label: 'يوم', value: remaining.days },
        { label: 'ساعة', value: remaining.hours },
        { label: 'دقيقة', value: remaining.minutes },
        { label: 'ثانية', value: remaining.seconds },
      ].map((unit) => (
        <div key={unit.label} className="bg-brick-500 text-white rounded-lg px-2 py-1.5 min-w-[52px]">
          <div className="font-extrabold text-base leading-none">{unit.value}</div>
          <div className="text-[10px] mt-1">{unit.label}</div>
        </div>
      ))}
    </div>
  )
}
