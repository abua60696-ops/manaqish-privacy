// أوقات الدوام: من 7 صباحاً حتى 2 ظهراً — يعاد التحقق كل دقيقة
import { useEffect, useState } from 'react'

export const OPEN_HOUR = 7
export const CLOSE_HOUR = 14

function checkIsOpen() {
  const hour = new Date().getHours()
  return hour >= OPEN_HOUR && hour < CLOSE_HOUR
}

export function useOpenHours() {
  const [isOpen, setIsOpen] = useState(checkIsOpen)

  useEffect(() => {
    const id = setInterval(() => setIsOpen(checkIsOpen()), 60_000)
    return () => clearInterval(id)
  }, [])

  return { isOpen, openHour: OPEN_HOUR, closeHour: CLOSE_HOUR }
}
