export default function QuantityStepper({
  value,
  onChange,
  min = 1,
}: {
  value: number
  onChange: (next: number) => void
  min?: number
}) {
  return (
    <div className="flex items-center gap-1 bg-sand-100 dark:bg-neutral-700 rounded-full">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-9 h-9 grid place-items-center text-lg font-bold rounded-full"
        aria-label="إنقاص الكمية"
      >
        −
      </button>
      <span className="w-6 text-center font-extrabold">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-9 h-9 grid place-items-center text-lg font-bold rounded-full"
        aria-label="زيادة الكمية"
      >
        +
      </button>
    </div>
  )
}
