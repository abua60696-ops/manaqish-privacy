import { ORDER_STAGES } from '../services/orderService'
import type { OrderStatus } from '../types'

export default function StatusStepper({ status }: { status: OrderStatus }) {
  const currentIndex = ORDER_STAGES.indexOf(status)

  return (
    <div className="flex items-start">
      {ORDER_STAGES.map((stage, i) => {
        const done = i <= currentIndex
        return (
          <div key={stage} className="flex-1 flex flex-col items-center relative">
            {i > 0 && (
              <div
                className={`absolute top-4 right-1/2 w-full h-1 -z-0 ${
                  i <= currentIndex ? 'bg-brick-500' : 'bg-neutral-200 dark:bg-neutral-700'
                }`}
              />
            )}
            <div
              className={`w-8 h-8 rounded-full grid place-items-center text-xs font-extrabold z-10 ${
                done ? 'bg-brick-500 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
              }`}
            >
              {done ? '✓' : i + 1}
            </div>
            <span className={`text-[11px] font-bold mt-2 text-center ${done ? 'text-brick-600 dark:text-ember-400' : 'text-neutral-400'}`}>
              {stage}
            </span>
          </div>
        )
      })}
    </div>
  )
}
